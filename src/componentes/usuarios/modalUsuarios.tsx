import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { LiaAddressCardSolid } from "react-icons/lia";
import { MdOutlineDateRange, MdOutlineMailOutline } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

export default function ModalRegistro({
  isOpen,
  onClose,
  onRegister,
  usuario,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "usuario",
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo_electronico: usuario.correo_electronico,
        fecha_nacimiento: usuario.fecha_nacimiento,
        direccion: usuario.direccion,
        contraseña: "",
        confirmarContraseña: "",
        rol: usuario.rol || "usuario",
      });
      setErrors({});
    } else {
      setFormData({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        correo_electronico: "",
        fecha_nacimiento: "",
        direccion: "",
        contraseña: "",
        confirmarContraseña: "",
        rol: "usuario",
      });
    }
  }, [usuario]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
      case "apellido_paterno":
      case "apellido_materno":
        if (!value.trim()) error = "Campo obligatorio.";
        else if (!nameRegex.test(value)) error = "Solo letras y espacios.";
        break;

      case "correo_electronico":
        if (!value.trim()) error = "Correo obligatorio.";
        else if (!emailRegex.test(value)) error = "Formato de correo inválido.";
        break;

      case "fecha_nacimiento":
        if (!value) error = "Campo obligatorio.";
        else {
          const fecha = new Date(value);
          const hoy = new Date();
          const hace60Anios = new Date();
          hace60Anios.setFullYear(hoy.getFullYear() - 60);
          if (fecha > hoy) error = "No puede ser una fecha futura.";
          else if (fecha < hace60Anios)
            error = "La edad no puede superar los 60 años.";
        }
        break;

      case "direccion":
        if (!value.trim()) error = "La dirección es obligatoria.";
        break;

      case "contraseña":
        if (!usuario && !value) error = "Campo obligatorio.";
        else if (!usuario && !passwordRegex.test(value))
          error = "Debe tener 8 caracteres, letras y números.";
        break;

      case "confirmarContraseña":
        if (!usuario && value !== formData.contraseña)
          error = "Las contraseñas no coinciden.";
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];
    const correoExistente = usuariosGuardados.find(
      (u) =>
        u.correo_electronico === formData.correo_electronico &&
        (!usuario || u.id !== usuario.id)
    );

    if (correoExistente) {
      setErrors({
        ...errors,
        correo_electronico: "Este correo ya está registrado.",
      });
      return;
    }

    const nuevoUsuario = {
      id: usuario ? usuario.id : Date.now(),
      ...formData,
    };

    if (usuario) {
      const index = usuariosGuardados.findIndex((u) => u.id === usuario.id);
      if (index !== -1) usuariosGuardados[index] = nuevoUsuario;
    } else {
      usuariosGuardados.push(nuevoUsuario);
    }

    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    onRegister();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl p-10 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {usuario ? "Editar Usuario" : "Registrar Usuario"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
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
          ]
            .concat(
              !usuario
                ? [
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
                  ]
                : []
            )
            .map((campo, i) => (
              <div key={i}>
                <div
                  className={`flex items-center border-b-2 pb-2 ${
                    errors[campo.name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input
                    type={campo.type || "text"}
                    placeholder={campo.placeholder}
                    name={campo.name}
                    value={formData[campo.name]}
                    onChange={handleChange}
                    className={`w-full bg-transparent outline-none placeholder-gray-600 text-gray-800 ${
                      errors[campo.name] ? "text-red-600" : ""
                    }`}
                    required
                  />
                  <span
                    className={`text-2xl ml-3 ${
                      errors[campo.name] ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {campo.icon}
                  </span>
                </div>
                {errors[campo.name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[campo.name]}
                  </p>
                )}
              </div>
            ))}

          {/* Rol */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-gray-700 font-semibold">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="border-b-2 border-gray-300 pb-2 outline-none text-gray-700"
            >
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-accent text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              {usuario ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
