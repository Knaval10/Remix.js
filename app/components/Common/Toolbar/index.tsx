import React from "react";

const Toolbar = ({ children }: any) => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  return (
    <main className="bg-gray-50 h-full shadow-2xl max-h-100vh">
      <section className="flex gap-[30%] bg-red-400 px-5 text-white text-xl font-bold">
        <h1 className="bg-blue-500 py-3 px-2">Bipad Portal</h1>
        <h2 className="py-3 px-2">National</h2>
      </section>
      <section className="p-2 flex flex-col gap-2 text-black">
        <p>
          Showing Data From{" "}
          <span className="font-bold">
            {sevenDaysAgo.toLocaleDateString("default", { year: "numeric" })}-
            {sevenDaysAgo.toLocaleDateString("default", { month: "2-digit" })}-
            {sevenDaysAgo.toLocaleDateString("default", { day: "2-digit" })}
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
    </main>
  );
};

export default Toolbar;
