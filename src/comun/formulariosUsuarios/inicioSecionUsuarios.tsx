import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

export default function InicioSesionUsuarios() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioEncontrado = usuarios.find(
      (user: any) => user.correo_electronico === correo
    );

    if (!usuarioEncontrado) {
      setError("Correo no registrado");
      return;
    }

    if (usuarioEncontrado.contraseña !== contrasena) {
      setError("Contraseña incorrecta");
      return;
    }

    setError("");
    navigate("/panelControl");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#E6B8B8] p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border-t-8 border-[#D4AF37]">
        {/* Logo / título */}
        <h2 className="text-3xl font-bold text-center mb-4 text-[#5A3825]">
          DULCE TENTACIÓN
        </h2>
        <h3 className="text-2xl font-semibold text-center mb-8 text-[#5A3825]">
          INICIAR SESIÓN
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Correo */}
          <div className="flex items-center border-b-2 border-[#5A3825] pb-2">
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full bg-transparent outline-none placeholder-[#5A3825] text-[#5A3825]"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <MdOutlineMailOutline className="text-2xl text-[#5A3825] ml-3" />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border-b-2 border-[#5A3825] pb-2">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-transparent outline-none placeholder-[#5A3825] text-[#5A3825]"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <GiPadlock className="text-2xl text-[#5A3825] ml-3" />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          )}

          {/* Botón */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#5A3825] text-[#E6B8B8] px-8 py-3 rounded-lg font-semibold 
              hover:bg-[#3E2618] hover:text-[#D4AF37] transition-all duration-300 shadow-md"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
