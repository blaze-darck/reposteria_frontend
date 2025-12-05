import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineChartBar,
  HiOutlineShoppingBag,
} from "react-icons/hi";

const sidebarLinks = [
  {
    id: 1,
    title: "Productos",
    href: "/administrator/productos",
    icon: HiOutlineViewGrid,
  },
  {
    id: 2,
    title: "Usuarios",
    href: "/administrator/usuarios",
    icon: HiOutlineUsers,
  },
  {
    id: 3,
    title: "Estadísticas",
    href: "/administrator/estadisticas",
    icon: HiOutlineChartBar,
  },
  {
    id: 4,
    title: "Pedidos",
    href: "/administrator/pedidos",
    icon: HiOutlineShoppingBag,
  },
  {
    id: 5,
    title: "Pedidos Cajero",
    href: "/administrator/cajero",
    icon: HiOutlineShoppingBag,
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (usuarioActual) {
      setUsuario(JSON.parse(usuarioActual));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg_fondo border-r border-slate-200 min-h-screen p-5 flex flex-col justify-between">
      {/* LINKS */}
      <div className="space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primario text-black"
                    : "text-slate-700 hover:bg-pink-200"
                }`
              }
            >
              <Icon size={22} />
              <span className="font-medium">{link.title}</span>
            </NavLink>
          );
        })}
      </div>

      {/* USUARIO Y LOGOUT ABAJO */}
      {usuario && (
        <div className="mt-5 p-4 bg-[#e8dfd5] rounded-lg flex items-center gap-3 border border-slate-300">
          <div className="w-10 h-10 rounded-full bg-cyan-600 text-white grid place-items-center font-bold text-lg">
            {usuario.nombre?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{usuario.nombre}</p>
            <p className="text-xs text-gray-600">{usuario.rol}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
          >
            Salir
          </button>
        </div>
      )}
    </aside>
  );
};
