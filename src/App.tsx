// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import RegistroUsuarios from "./comun/formulariosUsuarios/registroUsuarios";
import InicioSecionUsuarios from "./comun/formulariosUsuarios/inicioSecionUsuarios";
import Layout from "./comun/vistarPaginaWeb/layout";

import PanelControl from "./paginas/panelControl";
import Usuarios from "./paginas/Usuarios";
import Productos from "./paginas/Productos";

function App() {
  return (
    <Routes>
      {/* Ruta pública (sin layout) */}
      <Route path="/registro" element={<RegistroUsuarios />} />
      <Route path="/inciosecion" element={<InicioSecionUsuarios />} />

      {/* Rutas privadas con layout */}
      <Route path="/" element={<Layout />}>
        <Route path="panelControl" element={<PanelControl />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="productos" element={<Productos />} />
      </Route>
    </Routes>
  );
}

export default App;
