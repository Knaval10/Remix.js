import { Link, useNavigate } from "@remix-run/react";
import React from "react";
const SidebarData = [
  {
    id: 1,
    title: "Dashboard",
    link: "/admin",
  },
  {
    id: 2,
    title: "Employee",
    link: "/admin/employee",
  },
  {
    id: 3,
    title: "Company",
    link: "/admin/company",
  },
  {
    id: 4,
    title: "Settings",
    link: "/admin/settings",
  },
  {
    id: 5,
    title: "Digital Locker",
    link: "/admin/digital-locker",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const clearLocalStorage = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <aside className="bg-gray-900 w-64 min-h-screen p-5">
      <nav className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">ADMIN</h2>
          <section className="flex flex-col relative group">
            <div className="w-10 h-10 rounded-full border border-red-500 cursor-pointer"></div>
            <div className="absolute top-11 right-0 w-24 px-4 py-1 border border-green-500 opacity-0 transition-opacity duration-2000 delay-200 group-hover:opacity-100 group-hover:delay-100 z-10">
              <Link to="" className="block text-white hover:text-gray-400">
                Profile
              </Link>
              <span
                onClick={() => clearLocalStorage()}
                className="block cursor-pointer text-white hover:text-gray-400"
              >
                Log Out
              </span>
            </div>
          </section>
        </div>

        <ul className="flex flex-col gap-8">
          {SidebarData.map(({ id, title, link }) => (
            <li key={id}>
              <Link
                to={link}
                className="block text-white hover:text-gray-300 transition-colors duration-200"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
