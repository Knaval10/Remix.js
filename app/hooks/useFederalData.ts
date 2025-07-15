import { useState } from "react";
import { baseURL } from "~/services/alert";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string;
};

type FederalData = {
  province: FetchState<any>;
  district: FetchState<any>;
  municipality: FetchState<any>;
};

export const useFederalData = () => {
  const [federalData, setFederalData] = useState<FederalData>({
    province: { data: null, loading: false, error: "" },
    district: { data: null, loading: false, error: "" },
    municipality: { data: null, loading: false, error: "" },
  });

  // Generic fetcher
  const fetchData = async (key: keyof FederalData, endpoint: string) => {
    setFederalData((prev) => ({
      ...prev,
      [key]: { ...prev[key], loading: true },
    }));

    try {
      const res = await fetch(`${baseURL}/${endpoint}/`);
      const data = await res.json();

      setFederalData((prev) => ({
        ...prev,
        [key]: { data, loading: false, error: "" },
      }));
    } catch (err) {
      setFederalData((prev) => ({
        ...prev,
        [key]: { data: null, loading: false, error: `Failed to fetch ${key}` },
      }));
    }
  };

  // Public API
  return {
    ...federalData,
    fetchProvince: () => fetchData("province", "province"),
    fetchDistrict: () => fetchData("district", "district"),
    fetchMunicipality: () => fetchData("municipality", "municipality"),
  };
};
