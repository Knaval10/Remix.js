import React, { useState } from "react";
import Select from "~/components/Common/Select";
import FilterHead from "./FilterHead";
import { useFederal } from "~/lib/context/FederalContext";

const FederalFilter = ({
  openFilterOpt,
  setOpenFilterOpt,
  province,
  district,
  municipality,
  ward,
}: any) => {
  const {
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedMunicipality,
    setSelectedMunicipality,
  }: any = useFederal();

  // Filter districts based on selectedProvince
  const filteredDistricts =
    district?.data?.results?.filter(
      (d: any) => String(d.province) === selectedProvince
    ) || [];

  // Filter municipalities based on selectedDistrict
  const filteredMunicipalities =
    municipality?.data?.results?.filter(
      (m: any) => String(m.district) === selectedDistrict
    ) || [];

  // Filter wards based on selectedMunicipality
  const filteredWards =
    ward?.data?.results?.filter(
      (w: any) => String(w.municipality) === selectedMunicipality
    ) || [];

  return (
    <section className="flex flex-col gap-5">
      <FilterHead
        openFilterOpt={openFilterOpt}
        setOpenFilterOpt={setOpenFilterOpt}
        heading="Federal"
      />
      {/* Province */}
      <Select
        selectData={{ data: { results: province?.data?.results || [] } }}
        selected={selectedProvince}
        setSelected={(val: string) => {
          setSelectedProvince(val);
          setSelectedDistrict("");
          setSelectedMunicipality("");
          // setSelectedWard("");
        }}
        placeholder="Select Province"
      />
      {/* District (filtered) */}
      <Select
        selectData={{ data: { results: filteredDistricts } }}
        selected={selectedDistrict}
        setSelected={(val: string) => {
          setSelectedDistrict(val);
          setSelectedMunicipality("");
          // setSelectedWard("");
        }}
        disabled={!selectedProvince}
        placeholder="Select District"
      />
      {/* Municipality (filtered) */}
      <Select
        selectData={{ data: { results: filteredMunicipalities } }}
        selected={selectedMunicipality}
        setSelected={(val: string) => {
          setSelectedMunicipality(val);
          // setSelectedWard("");
        }}
        disabled={!selectedDistrict}
        placeholder="Select Municipality"
      />
      {/* Ward (filtered) */}
      {/* <Select
        selectData={{ data: { results: filteredWards } }}
        selected={selectedWard}
        setSelected={setSelectedWard}
        disabled={!selectedMunicipality}
        placeholder="Select Ward"
      /> */}
      <button className="text-white text-sm font-semibold bg-red-400 rounded-sm hover:font-bold h-10 w-20 mt-2">
        Submit
      </button>
    </section>
  );
};

export default FederalFilter;
