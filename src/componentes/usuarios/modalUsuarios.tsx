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
  });

  // Efecto para llenar el formulario con los datos del usuario si se está editando
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo_electronico: usuario.correo_electronico,
        fecha_nacimiento: usuario.fecha_nacimiento,
        direccion: usuario.direccion,
        contraseña: "", // La contraseña y confirmarContraseña se vacían en edición
        confirmarContraseña: "",
      });
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
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificamos que las contraseñas coincidan solo cuando sea un nuevo usuario
    if (!usuario && formData.contraseña !== formData.confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoUsuario = {
      id: usuario ? usuario.id : Date.now(), // Si es edición, usamos el ID existente
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      correo_electronico: formData.correo_electronico,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
    };

    // Recuperamos los usuarios almacenados en el localStorage
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuario) {
      // Si es edición, actualizamos el usuario con el ID correcto
      const index = usuariosGuardados.findIndex(
        (user) => user.id === usuario.id
      );
      if (index !== -1) {
        // Actualizamos el usuario en el arreglo
        usuariosGuardados[index] = nuevoUsuario;
      }
    } else {
      // Si es creación, agregamos un nuevo usuario al arreglo
      usuariosGuardados.push(nuevoUsuario);
    }

    // Guardamos los usuarios actualizados en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Llamamos a la función onRegister para notificar que el usuario ha sido registrado/actualizado
    onRegister();

    // Cerramos el modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-gray-900 bg-opacity-50 w-full max-w-sm p-8 rounded-lg shadow-lg relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {usuario ? "Editar Usuario" : "Registrar Usuario"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nombre */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <FaUserCircle className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Apellido Paterno */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="text"
                placeholder="Apellido Paterno"
                name="apellido_paterno"
                value={formData.apellido_paterno}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <FaUserCircle className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Apellido Materno */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="text"
                placeholder="Apellido Materno"
                name="apellido_materno"
                value={formData.apellido_materno}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <FaUserCircle className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Correo Electrónico */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="email"
                placeholder="Correo Electrónico"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <MdOutlineMailOutline className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <MdOutlineDateRange className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Dirección */}
            <div className="flex items-center border-b-2 border-gray-300 pb-2">
              <input
                type="text"
                placeholder="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-600"
                required
              />
              <LiaAddressCardSolid className="text-2xl text-gray-600 ml-3" />
            </div>

            {/* Campo Contraseña */}
            {!usuario && (
              <div className="flex items-center border-b-2 border-gray-300 pb-2">
                <input
                  type="password"
                  placeholder="Contraseña"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none placeholder-gray-600"
                  required
                />
                <GiPadlock className="text-2xl text-gray-600 ml-3" />
              </div>
            )}

            {/* Campo Confirmar Contraseña */}
            {!usuario && (
              <div className="flex items-center border-b-2 border-gray-300 pb-2">
                <input
                  type="password"
                  placeholder="Confirme Contraseña"
                  name="confirmarContraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none placeholder-gray-600"
                  required
                />
                <GiPadlock className="text-2xl text-gray-600 ml-3" />
              </div>
            )}

            {/* Botón de Enviar */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {usuario ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </form>

          {/* Botón para cerrar el modal */}
          <div className="absolute top-0 right-0 p-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
