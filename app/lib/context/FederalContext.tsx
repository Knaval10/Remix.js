import { createContext, useContext, useState } from "react";

type FederalContextType = {
  selectedProvince: string;
  setSelectedProvince: React.Dispatch<React.SetStateAction<string>>;
  selectedDistrict: string;
  setSelectedDistrict: React.Dispatch<React.SetStateAction<string>>;
  selectedMunicipality: string;
  setSelectedMunicipality: React.Dispatch<React.SetStateAction<string>>;
};

const FederalContext = createContext<FederalContextType | undefined>(undefined);

export const FederalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  return (
    <FederalContext.Provider
      value={{
        selectedProvince,
        setSelectedProvince,
        selectedDistrict,
        setSelectedDistrict,
        selectedMunicipality,
        setSelectedMunicipality,
      }}
    >
      {children}
    </FederalContext.Provider>
  );
};

export const useFederal = () => {
  const context = useContext(FederalContext);
  if (!context) {
    throw new Error("useFederal must be used inside a <FederalProvider>");
  }
  return context;
};
