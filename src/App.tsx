import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./comun/navbar";
import Sidebar from "./comun/sidebar";
import Usuarios from "./paginas/Usuarios";
import Productos from "./paginas/Productos";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-4 flex-1">
          <Routes>
            <Route path="/" element={<h1>Panel de Control</h1>} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
