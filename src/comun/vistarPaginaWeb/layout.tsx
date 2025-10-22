import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 flex-1">
          <Outlet /> {/* Aquí se renderizan las páginas hijas */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
