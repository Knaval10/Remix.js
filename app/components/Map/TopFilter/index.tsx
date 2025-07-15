import React from "react";
import FederalFilter from "./FederalFilter";
import HazardFilter from "./HazardFilter";
import TimeRangeFilter from "./TimeRangeFilter";
const FilterTabItems = [
  {
    id: 1,
    title: "L",
  },
  {
    id: 2,
    title: "H",
  },
  {
    id: 3,
    title: "R",
  },
];
const TopFilter = ({
  selectedFilter,
  setSelectedFilter,
  province,
  district,
  municipality,
  ward,
}: any) => {
  const FilterMap: any = {
    1: (
      <FederalFilter
        openFilterOpt={selectedFilter}
        setOpenFilterOpt={setSelectedFilter}
        province={province}
        district={district}
        municipality={municipality}
        ward={ward}
      />
    ),
    2: <HazardFilter />,
    3: <TimeRangeFilter />,
  };
  return (
    <main className="flex flex-col gap-2 bg-white px-3 py-2 rounded-lg w-40 h-fit shadow-xl ">
      <section className="flex justify-between">
        <h2 className="text-blue-500 font-semibold text-sm">Filters</h2>
      </section>
      <section className="flex gap-5s border-b border-gray-500 text-black cursor-pointer">
        {FilterTabItems?.map((item) => (
          <div
            onClick={() => setSelectedFilter(item.id)}
            key={item.id}
            className={`p-2 font-semibold text-sm ${
              selectedFilter === item.id
                ? "border-b border-red-500 text-red-500"
                : ""
            }`}
          >
            {item.title}
          </div>
        ))}
      </section>
      <section>{selectedFilter && FilterMap[selectedFilter]}</section>
    </main>
  );
};

export default TopFilter;
