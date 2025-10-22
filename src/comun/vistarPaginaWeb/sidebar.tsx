import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menus = [
    { name: "Panel de Control", link: "panelControl", icon: RxDashboard },
    { name: "Usuarios", link: "usuarios", icon: FaRegUser },
    { name: "Productos", link: "productos", icon: FiShoppingCart },
  ];
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <section className="flex gap-6">
      <div
        className={`bg-[#5A3825] min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-[#E6B8B8] px-4 shadow-xl`}
      >
        {/* Botón para abrir/cerrar */}
        <div className="py-3 flex justify-end">
          <HiMenuAlt1
            size={26}
            className="cursor-pointer text-[#D4AF37] hover:text-[#C49B2A] transition-colors duration-300"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Menú lateral */}
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className="group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md 
              hover:bg-[#3E2618] hover:text-[#D4AF37] transition-all duration-300"
            >
              <div className="text-[#E6B8B8] group-hover:text-[#D4AF37] transition-colors duration-300">
                {React.createElement(menu?.icon, { size: 20 })}
              </div>

              {/* Texto normal */}
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>

              {/* Tooltip cuando está cerrado */}
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-[#E6B8B8] text-[#5A3825] font-semibold whitespace-pre rounded-md drop-shadow-lg 
                px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 
                group-hover:duration-300 group-hover:w-fit`}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenedor principal derecho */}
      <div className="m-3 text-xl text-[#5A3825] font-semibold"></div>
    </section>
  );
};

export default Sidebar;
