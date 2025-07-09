import { Link, useLocation } from "@remix-run/react";
import React from "react";
import { navData } from "./Header";
const webSidebarData = [
  {
    id: 1,
    title: "Dashboard",
    link: "/",
  },
  {
    id: 2,
    title: "Incident",
    link: "/incident",
  },
  {
    id: 3,
    title: "Damage & Loss",
    link: "/damage-loss",
  },
  {
    id: 4,
    title: "Real Time",
    link: "/realtime",
  },
  {
    id: 5,
    title: "Profile",
    link: "/profile",
  },
  {
    id: 6,
    title: "Risk Info",
    link: "/riskinfo",
  },
  {
    id: 7,
    title: "Data Archive",
    link: "/data-archive",
  },
  {
    id: 8,
    title: "Viz Risk",
    link: "/vizrisk",
  },
  {
    id: 9,
    title: "IBF",
    link: "/ibf",
  },
];
const WebSidebar = () => {
  const location = useLocation();
  return (
    <nav className="flex flex-col justify-between bg-white h-screen shadow-2xl fixed right-0">
      <ul className="flex flex-col">
        {webSidebarData.map((item) => (
          <li
            key={item.id}
            className="flex flex-col text-black text-xs active:bg-red-400 hover:bg-red-400 hover:text-white"
          >
            <Link
              to={item.link}
              className={`px-1 py-5 flex flex-col items-center gap-1 font-semibold text-center ${
                item.link === location.pathname ? "bg-red-400 text-white" : ""
              }`}
            >
              <figure>🏠</figure>
              {item.title}
            </Link>
            <hr />
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 p-2  text-black">
        {navData.map((item) => (
          <Link key={item.id} to={item.link} className="hover:text-gray-500">
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default WebSidebar;
