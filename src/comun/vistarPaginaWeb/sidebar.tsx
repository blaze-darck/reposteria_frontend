import React, { useEffect, useState } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [usuarioActual, setUsuarioActual] = useState<any>(null);

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioActual");
    if (usuario) setUsuarioActual(JSON.parse(usuario));
  }, []);

  const menus = [
    {
      name: "Panel de Control",
      link: "panelControl",
      icon: RxDashboard,
      roles: ["administrador"],
    },
    {
      name: "Usuarios",
      link: "usuarios",
      icon: FaRegUser,
      roles: ["administrador"],
    },
    {
      name: "Productos",
      link: "productos",
      icon: FiShoppingCart,
      roles: ["administrador"],
    },
    {
      name: "Pedidos",
      link: "pedidos",
      icon: FiShoppingCart,
      roles: ["administrador"],
    },
    {
      name: "Menu Principal",
      link: "panelUsuario",
      icon: FiShoppingCart,
      roles: ["usuario"],
    },
    {
      name: "Productos",
      link: "productosUsuario",
      icon: FiShoppingCart,
      roles: ["usuario"],
    },
  ];

  // Filtrar menús según rol del usuario
  const menusFiltrados = menus.filter(
    (menu) =>
      !menu.roles || (usuarioActual && menu.roles.includes(usuarioActual.rol))
  );

  return (
    <section className="flex gap-6 overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`bg-primario min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-texto px-4 shadow-xl relative`}
      >
        {/* Botón abrir/cerrar */}
        <div className="py-3 flex justify-end">
          <HiMenuAlt1
            size={26}
            className="cursor-pointer text-bg-secundario hover:text-bg-accent transition-colors duration-300"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Menú */}
        <div className="mt-4 flex flex-col gap-4 relative">
          {menusFiltrados.map((menu, i) => (
            <Link
              to={menu.link}
              key={i}
              className="group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md 
                         hover:bg-primario-hover hover:text-bg-background transition-all duration-300 relative"
            >
              {/* Icono */}
              <div className="text-bg-secundario group-hover:text-secunadrio transition-colors duration-300">
                {React.createElement(menu.icon, { size: 20 })}
              </div>

              {/* Texto principal */}
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu.name}
              </h2>

              {/* Tooltip cuando el sidebar está cerrado */}
              {!open && (
                <h2
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background text-texto font-semibold whitespace-pre rounded-md drop-shadow-lg 
               px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 text-center"
                >
                  {menu.name}
                </h2>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
