import { Link } from "@remix-run/react";
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
  return (
    <aside className="bg-gray-900 w-64 min-h-screen p-5">
      <nav className="flex flex-col gap-10">
        <h2 className="text-2xl">ADMIN</h2>
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
