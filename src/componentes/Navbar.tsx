import React from "react";
import tailwindcss from "@tailwindcss/vite";
import { AiOutlineUser } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="pt-4 bg-white top-0 sticky ">
      <div className="container">
        <div className="flex justify-between items-center">
          <h1 className="text-4x1 font-bold cursor-pointer">
            PASTELERIA LA ROSITA
          </h1>
          <div className="flex gap4 md:gap-8 items-center">
            <div className="md:flex items-center gap-3 hidden">
              <div className="rounded-full border-2 border-gray-300 text-gray-500 text-3x1 w-15 h-15 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-200">
                <AiOutlineUser />
              </div>
              <div>
                <a href="#" className="text-gray-500">
                  Iniciar secion
                </a>
              </div>
            </div>
            <div className="text-gray-500 text-3x1 relative cursor-pointer">
              <FiShoppingCart />
              <div className="absolute -top-3 -rigth-2 bg-red-500 w-5 h-5 rounded-full text-white text-flex items-center justify-center">
                0
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200.pt-4"></div>
    </div>
  );
};
export default Navbar;
