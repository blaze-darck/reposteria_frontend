import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { LiaAddressCardSolid } from "react-icons/lia";
import { MdOutlineDateRange, MdOutlineMailOutline } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

export default function RegistroUsuarios() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const nuevoUsuario = {
      id: Date.now(),
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      correo_electronico: formData.correo_electronico,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      fecha_nacimiento: "",
      direccion: "",
      contraseña: "",
      confirmarContraseña: "",
    });

    navigate("/panelControl");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#E6B8B8] p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 border-t-8 border-[#D4AF37]">
        {/* Encabezado */}
        <h2 className="text-3xl font-bold text-center mb-4 text-[#5A3825]">
          DULCE TENTACIÓN
        </h2>
        <h3 className="text-2xl font-semibold text-center mb-8 text-[#5A3825]">
          REGISTRO DE USUARIOS
        </h3>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Campos de entrada */}
          {[
            { name: "nombre", placeholder: "Nombre", icon: <FaUserCircle /> },
            {
              name: "apellido_paterno",
              placeholder: "Apellido Paterno",
              icon: <FaUserCircle />,
            },
            {
              name: "apellido_materno",
              placeholder: "Apellido Materno",
              icon: <FaUserCircle />,
            },
            {
              name: "correo_electronico",
              placeholder: "Correo Electrónico",
              icon: <MdOutlineMailOutline />,
            },
            {
              name: "fecha_nacimiento",
              placeholder: "Fecha de Nacimiento",
              type: "date",
              icon: <MdOutlineDateRange />,
            },
            {
              name: "direccion",
              placeholder: "Dirección",
              icon: <LiaAddressCardSolid />,
            },
            {
              name: "contraseña",
              placeholder: "Contraseña",
              type: "password",
              icon: <GiPadlock />,
            },
            {
              name: "confirmarContraseña",
              placeholder: "Confirmar Contraseña",
              type: "password",
              icon: <GiPadlock />,
            },
          ].map((campo, i) => (
            <div
              key={i}
              className="flex items-center border-b-2 border-[#5A3825] pb-2"
            >
              <input
                type={campo.type || "text"}
                placeholder={campo.placeholder}
                name={campo.name}
                value={(formData as any)[campo.name]}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-[#5A3825] text-[#5A3825]"
                required
              />
              <span className="text-2xl text-[#5A3825] ml-3">{campo.icon}</span>
            </div>
          ))}

          {/* Botón */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#5A3825] text-[#E6B8B8] px-8 py-3 rounded-lg font-semibold 
              hover:bg-[#3E2618] hover:text-[#D4AF37] transition-all duration-300 shadow-md"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
