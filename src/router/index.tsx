import { createBrowserRouter } from "react-router-dom";
import Usuario from "../administrator/pages_administrator/usuarios";
import { RootLayout } from "../layouts/RootLayout";
import { RootAdmin } from "../administrator/RootAdmin";
import { Sidebar } from "../administrator/Sidebar";
import { Productos } from "../administrator/pages_administrator/Productos";
import { Estadisticas } from "../administrator/pages_administrator/estadisticas";
import { Pedidos } from "../administrator/pages_administrator/pedidos";
import { CajeroPedidos } from "../administrator/cajero/cajero";
import InicioSesionUsuarios from "../components/commons/login";
import RegistroUsuarios from "../components/commons/form";
import Categorias from "../pages/categorias";
import Articulos from "../pages/articulos";
import { LoginLayout } from "../layouts/LoginLayout";

import ProtectedRoute from "../router/rutasProtegidas";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Articulos />,
      },
      {
        path: "categorias",
        element: <Categorias />,
      },
    ],
  },

  {
    path: "/administrator",
    element: <ProtectedRoute roles={["Administrador"]} />,
    children: [
      {
        element: <RootAdmin />,
        children: [
          { path: "sidebar", element: <Sidebar /> },
          { path: "productos", element: <Productos /> },
          { path: "usuarios", element: <Usuario /> },
          { path: "estadisticas", element: <Estadisticas /> },
          { path: "pedidos", element: <Pedidos /> },
          { path: "cajero", element: <CajeroPedidos /> },
        ],
      },
    ],
  },
  {
    path: "/cajero",
    element: <ProtectedRoute roles={["Cajero"]} />,
    children: [
      { path: "sidebar", element: <Sidebar /> },
      {
        index: true,
        element: <CajeroPedidos />,
      },
    ],
  },

  {
    path: "/login",
    element: <LoginLayout />,
    children: [
      {
        index: true,
        element: <InicioSesionUsuarios />,
      },
      {
        path: "registro",
        element: <RegistroUsuarios />,
      },
    ],
  },
]);
