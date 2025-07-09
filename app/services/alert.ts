import { formatNepalDateForQueryNepalTZ } from "~/lib/utils/dateFunction";

const baseURL = import.meta.env.VITE_APP_API_SERVER_URL;
const today = new Date();
today.setHours(23, 59, 59, 999);
const sevenDaysAgo = new Date();
sevenDaysAgo.setHours(0, 0, 0, 0);
sevenDaysAgo.setDate(today.getDate() - 7);
const todayEncoded = formatNepalDateForQueryNepalTZ(today);
const sevenDaysAgoEncoded = formatNepalDateForQueryNepalTZ(sevenDaysAgo);

export const getAlertData = async () => {
  try {
    const res = await fetch(
      `${baseURL}/alert/?rainBasin=&rainStation=&riverBasin=&riverStation=&hazard=&inventoryItems=&started_on__gt=${sevenDaysAgoEncoded}&started_on__lt=${todayEncoded}&expand=event&ordering=-started_on`
    );
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
};
