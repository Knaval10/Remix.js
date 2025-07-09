import React from "react";
import BarGraph from "../../assets/icons/bar-graph.svg";
const DashboardTab = ({ tabItems, selectedItem, setSelectedItem }: any) => {
  return (
    <div className="flex">
      {tabItems.map((item: any, idx: number) => (
        <div
          key={item.id}
          onClick={() => setSelectedItem(item)}
          className={`flex flex-col items-center gap-2 p-3 cursor-pointer hover:bg-gray-200 ${
            selectedItem?.id === idx + 1 ? "bg-white" : ""
          }`}
        >
          {idx < 2 ? (
            <p className="text-red-500 text-4xl">{item.count}</p>
          ) : (
            <div className="w-10 h-10">
              <img src={BarGraph} alt="visualization graph" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className={`bg-gray-500 ${
                item.id === 1
                  ? "rounded-full w-4 h-4"
                  : item?.id === 2
                  ? "w-4 h-4"
                  : ""
              }`}
            />
            <h2 className="text-black">{item.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTab;
