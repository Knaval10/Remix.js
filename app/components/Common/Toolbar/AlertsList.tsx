import React, { useState } from "react";
import ForestFire from "../../../assets/icons/forest-fire.svg";
import Flood from "../../../assets/icons/flood.svg";
import HeavyRain from "../../../assets/icons/strong-rain.svg";
import BarGraph from "../../../assets/icons/bar-graph.svg";

const AlertsList = ({ alertList, hoveredItem, setHoveredItem }: any) => {
  const alertData = (alertList && alertList?.results) || [];

  return (
    <div className="flex flex-col max-h-[calc(100vh-260px)] overflow-auto scrollbar my-2">
      {alertData?.length > 0 &&
        alertData.map((item: any, idx: number) => (
          <div
            key={item.id}
            onMouseMove={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex flex-col cursor-pointer hover:bg-gray-200 ${
              idx < 2 ? "bg-green-100" : ""
            } ${hoveredItem === item.id ? "bg-gray-200" : ""}`}
          >
            <section className="text-black flex items-center gap-4 px-2 py-0.5 w-full">
              <figure className="w-20% h-8">
                <img
                  src={
                    item.referenceType === "rain"
                      ? HeavyRain
                      : item.referenceType === "river"
                      ? Flood
                      : item.referenceType === "fire"
                      ? ForestFire
                      : ""
                  }
                  alt="disaster icons"
                  className="w-full h-full"
                />
              </figure>
              <article className="flex flex-col py-2 w-[80%]">
                <p className="font-semibold">{item.title}</p>
                <div className="flex gap-3 text-xs">
                  <span>{item.createdOn?.split("T")[0]}</span>{" "}
                  <span>
                    {new Date(item.startedOn).toLocaleTimeString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </article>
            </section>
            <hr />
          </div>
        ))}
    </div>
  );
};

export default AlertsList;
