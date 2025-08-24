import React from "react";
import ChevronDown from "~/assets/dynamic/ChevronDown";

const FilterHead = ({ setOpenFilterOpt, heading = "" }: any) => {
  return (
    <div className="flex justify-between items-center w-full text-black text-xs font-semibold">
      <h2>{heading}</h2>
      <ChevronDown
        onClick={() => setOpenFilterOpt(false)}
        className="cursor-pointer"
      />
    </div>
  );
};

export default FilterHead;
