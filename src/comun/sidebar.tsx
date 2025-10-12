import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menus = [
    { name: "Panel_Control", link: "/", icon: RxDashboard },
    { name: "Usuarios", link: "/", icon: FaRegUser },
    { name: "Productos", link: "/", icon: FiShoppingCart },
  ];
  const [open, setOpen] = React.useState<boolean>(true);
  return (
    <section className="flex gap-6 ">
      <div
        className={`bg-[#0e0e0e] min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt1
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex-col gap-4 relative">
          {menus.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
            >
              <div>{React.createElement(menu?.icon, { size: 20 })}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duraion-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py- w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      <div className="m-3 text-x1 text-gray-900 font-semibold"></div>
    </section>
  );
};
export default Sidebar;
