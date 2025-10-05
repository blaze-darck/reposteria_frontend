import React from "react";

interface ModalProps {
  estaAbierto: boolean;
  estaCerrado: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  estaAbierto,
  estaCerrado,
  children,
}) => {
  if (!estaAbierto) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      onClick={estaCerrado}
    >
      <div
        className="bg-white rounded-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={estaCerrado}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
