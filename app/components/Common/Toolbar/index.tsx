import React from "react";
import ChevronDown from "~/assets/dynamic/ChevronDown";

const Toolbar = ({ children, showToolbar, setShowToolbar }: any) => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  return (
    <main className="bg-gray-50 h-full shadow-2xl max-h-100vh  relative">
      <div
        className={`bg-gray-50 h-full shadow-2xl relative transition-transform duration-300 ${
          showToolbar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <section className="flex gap-[30%] bg-red-400 px-5 text-white text-xl font-bold">
          <h1 className="bg-blue-500 py-3 px-2">Bipad Portal</h1>
          <h2 className="py-3 px-2">National</h2>
        </section>
        <section className="p-2 flex flex-col gap-2 text-black">
          <p>
            Showing Data From{" "}
            <span className="font-bold">
              {sevenDaysAgo.toLocaleDateString("default", { year: "numeric" })}-
              {sevenDaysAgo.toLocaleDateString("default", { month: "2-digit" })}
              -{sevenDaysAgo.toLocaleDateString("default", { day: "2-digit" })}
            </span>{" "}
            to{" "}
            <span className="font-bold">
              {today.toLocaleDateString("default", { year: "numeric" })}-
              {today.toLocaleDateString("default", { month: "2-digit" })}-
              {today.toLocaleDateString("default", { day: "2-digit" })}
            </span>
          </p>
          <p>Data sources: Nepal Police, DRR Portal</p>
        </section>
        <section className="">{children}</section>
      </div>
      <div
        onClick={() => setShowToolbar((prev: any) => !prev)}
        className="flex items-center justify-center bg-white shadow-2xl absolute top-1/2 -right-2.5 transform translate-x-1/2 duration-300 border border-l-0 rounded-r z-10 h-10 w-5 cursor-pointer text-black"
      >
        <ChevronDown
          className={`transition-transform duration-300 ${
            showToolbar ? "rotate-90" : "-rotate-90"
          }`}
        />
      </div>
    </main>
  );
};

export default Toolbar;
