// ModalNavbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface ModalNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNavbar({ isOpen, onClose }: ModalNavbarProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-20 z-50 bg-white rounded-lg shadow-lg p-6 w-64 text-center">
      <h2 className="text-xl font-semibold mb-4">¿Qué deseas hacer?</h2>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => {
            navigate("/registro");
            onClose();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Registrarse
        </button>
        <button
          onClick={() => {
            navigate("/inciosecion");
            onClose();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 mt-2 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
