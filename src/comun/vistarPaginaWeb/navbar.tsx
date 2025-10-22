// Navbar.tsx
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import ModalNavbar from "./componentesSitioWeb/modalNavbar";

const Navbar: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="pt-4 bg-[#E6B8B8] top-0 sticky z-50 shadow-lg">
        <div className="px-4">
          <div className="flex justify-between items-center">
            {/* Logo / Título */}
            <h1 className="text-4xl font-bold cursor-pointer text-[#5A3825] hover:text-[#C49B2A] transition-colors duration-300">
              Dulce Tentación
            </h1>

            {/* Iconos */}
            <div className="flex gap-4 md:gap-8 items-center">
              <div className="md:flex items-center gap-3 hidden">
                <div
                  onClick={() => setModalOpen(true)}
                  className="rounded-full border border-[#D4AF37] text-[#5A3825] text-3xl w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-[#5A3825] hover:text-[#F0CFCF] transition-all duration-300 hover:scale-105"
                >
                  <AiOutlineUser className="w-8 h-8" />
                </div>
              </div>

              {/* Carrito */}
              <div className="text-[#5A3825] text-3xl relative cursor-pointer hover:text-[#3E2618] transition-all duration-300 hover:scale-110">
                <FiShoppingCart className="w-8 h-8" />
                <div className="absolute -top-3 -right-2 bg-[#D4AF37] w-5 h-5 rounded-full text-[#5A3825] flex items-center justify-center text-sm font-bold shadow-md">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-b border-[#D4AF37] pt-4"></div>
      </div>

      <ModalNavbar isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
