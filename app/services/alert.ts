const baseURL = import.meta.env.VITE_APP_API_SERVER_URL;

export const getAlertData = async () => {
  try {
    const res = await fetch(
      `${baseURL}/alert/?rainBasin=&rainStation=&riverBasin=&riverStation=&hazard=&inventoryItems=&started_on__gt=2025-06-25T00%3A00%3A00%2B05%3A45&started_on__lt=2025-07-02T23%3A59%3A59%2B05%3A45&expand=event&ordering=-started_on`
    );
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch alert data:", error);
    return null;
  }
};
