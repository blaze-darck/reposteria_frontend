import React, { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ModalNavbar from "./componentesSitioWeb/modalNavbar";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<any>(null);

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioActual");
    if (usuario) setUsuarioActual(JSON.parse(usuario));
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Desea cerrar sesión?")) {
      localStorage.removeItem("usuarioActual");
      setUsuarioActual(null);
      navigate("/inciosecion");
    }
  };

  return (
    <>
      <div className="pt-4 bg-primario top-0 sticky z-50 shadow-lg">
        <div className="px-4">
          <div className="flex justify-between items-center">
            {/* Logo / Título */}
            <h1
              className="text-4xl font-bold cursor-pointer text-texto hover:text-secondary transition-colors duration-300"
              onClick={() => navigate("/")}
            >
              Dulce Tentación
            </h1>

            {/* Iconos / Usuario */}
            <div className="flex gap-4 md:gap-8 items-center">
              {usuarioActual ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-start">
                    <span className="text-texto font-semibold">
                      Hola, {usuarioActual.nombre}
                    </span>
                    <span className="text-sm text-secondary">
                      {usuarioActual.rol}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-secundario text-texto rounded hover:bg-red-600 transition-all duration-300"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="md:flex items-center gap-3 hidden">
                  <div
                    onClick={() => setModalOpen(true)}
                    className="rounded-full border border-secondary text-texto text-3xl w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-texto hover:text-primary transition-all duration-300 hover:scale-105"
                  >
                    <AiOutlineUser className="w-8 h-8" />
                  </div>
                </div>
              )}

              {/* Carrito */}
              <div className="text-texto text-3xl relative cursor-pointer hover:text-secondary transition-all duration-300 hover:scale-110">
                <FiShoppingCart className="w-8 h-8" />
                <div className="absolute -top-3 -right-2 bg-secondary w-5 h-5 rounded-full text-texto flex items-center justify-center text-sm font-bold shadow-md">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-secondary pt-4"></div>
      </div>

      <ModalNavbar isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
