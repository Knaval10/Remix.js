import { Link } from "@remix-run/react";
import React from "react";
const navData = [
  {
    id: 1,
    title: "User",
    link: "/user",
  },
  {
    id: 2,
    title: "Admin",
    link: "/admin",
  },
  {
    id: 3,
    title: "Contact",
    link: "/contact",
  },
];
const Header = () => {
  return (
    <nav className="flex justify-between items-center p-5 bg-white text-black">
      <Link to="/" className="text-xl font-bold">
        Remix
      </Link>
      <div className="flex gap-2 px-2">
        {navData.map((item) => (
          <Link key={item.id} to={item.link}>
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(Header);
