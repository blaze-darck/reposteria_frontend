import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import ModalRegistro from "./modalUsuarios";

export default function UsuariosTabla() {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  useEffect(() => {
    let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuariosGuardados.length === 0) {
      const adminPorDefecto = {
        id: Date.now(),
        nombre: "Gabriel",
        apellido_paterno: "Leonardo",
        apellido_materno: "Paredes",
        correo_electronico: "dilegabo62102@gmail.com",
        fecha_nacimiento: "2002/10/07",
        direccion: "Plan Autopista",
        contraseña: "dilegabo1234",
        rol: "administrador",
      };
      usuariosGuardados.push(adminPorDefecto);
      localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    }

    setUsuarios(usuariosGuardados);
  }, []);

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este usuario?")) {
      const usuariosActualizados = usuarios.filter((user) => user.id !== id);
      localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
      setUsuarios(usuariosActualizados);
    }
  };

  const abrirModal = () => setIsModalOpen(true);
  const cerrarModal = () => {
    setIsModalOpen(false);
    setUsuarioAEditar(null);
  };
  const editarUsuario = (usuario) => {
    setUsuarioAEditar(usuario);
    abrirModal();
  };
  const actualizarUsuarios = () => {
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
            Usuarios Registrados
          </h2>
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            title="Agregar usuario"
          >
            <span>Agregar</span>
            <FaPlus size={18} />
          </button>
        </div>

        {/* Tabla */}
        {usuarios.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 text-center min-w-[700px] md:min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Apellido Paterno
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Apellido Materno
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Correo Electrónico
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Fecha de Nacimiento
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Dirección
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Rol</th>
                  <th className="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {user.nombre}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.apellido_paterno}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.apellido_materno}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.correo_electronico}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.fecha_nacimiento}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.direccion}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.rol}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => editarUsuario(user)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar usuario"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => eliminarUsuario(user.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar usuario"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Registro */}
        <ModalRegistro
          isOpen={isModalOpen}
          onClose={cerrarModal}
          onRegister={actualizarUsuarios}
          usuario={usuarioAEditar}
        />
      </div>
    </div>
  );
}
