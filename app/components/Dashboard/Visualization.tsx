import React from "react";
import BarGraph from "../Charts/BarGraph";

const Visualization = ({ data }: any) => {
  const itemCounts =
    data &&
    data?.results?.length > 0 &&
    data?.results?.reduce((acc: any, item: any) => {
      const key =
        item.referenceType === "river"
          ? "Flood"
          : item.referenceType === "rain"
          ? "Heavy Rainfall"
          : "Forest Fire";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const graphData =
    itemCounts &&
    Object.entries(itemCounts).map(([name, count]) => ({
      name,
      count,
    }));

  return (
    <div className="flex flex-col gap-5 text-black p-5">
      <h2>Number of Alerts</h2>
      <div className="flex gap-3">
        {graphData?.length > 0 &&
          graphData.map((item: any, idx: number) => (
            <ul key={idx} className="flex flex-col gap-2">
              <li className="font-semibold">{item?.name}</li>
              <span className="text-red-500 text-xl font-semibold">
                {item?.count}
              </span>
            </ul>
          ))}
      </div>
      <div className="h-[350px] w-[400px] rotate-90 pt-20 pl-10s">
        <BarGraph data={graphData} />
      </div>
    </div>
  );
};

export default Visualization;
