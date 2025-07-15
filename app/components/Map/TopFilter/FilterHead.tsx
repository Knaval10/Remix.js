import React from "react";
import ChevronDown from "~/assets/dynamic/ChevronDown";

const FilterHead = ({ setOpenFilterOp, heading = "" }: any) => {
  return (
    <div className="flex justify-between items-center w-full text-black text-xs font-semibold">
      <h2>{heading}</h2>
      <ChevronDown onClick={() => setOpenFilterOp(false)} />
    </div>
  );
};

export default FilterHead;
