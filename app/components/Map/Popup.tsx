import React from "react";
import { parseStringIntoObject } from "~/lib/utils/parseFunction";

const Popup = ({ properties }: any) => {
  let description = properties.description;
  description = parseStringIntoObject(description);
  const title = properties.title;
  console.log("prop", properties);
  return (
    <main className="flex flex-col">
      <h1 className="text-white text-base leading-5 font-bold bg-blue-400 p-2">
        {title}
      </h1>
      <section className="flex flex-col gap-3 p-2 max-h-24 overflow-auto scrollbar">
        {description &&
          Object.entries(description).map(([key, value]: any) => (
            <div key={key} className="flex gap-2 text-gray-600 text-sm">
              <h2 className=" font-semibold">{key}:</h2> <p>{value}</p>
            </div>
          ))}
        <div className="flex gap-2 text-gray-600 text-sm ">
          <h2 className="font-semibold">Source:</h2>{" "}
          <p className="text-red-500">
            Department of Hydrology and Meteorology
          </p>
        </div>
      </section>
    </main>
  );
};

export default Popup;
