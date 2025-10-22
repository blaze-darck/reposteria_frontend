import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa"; // Importa FaEdit
import ModalRegistro from "./modalUsuarios"; // Importamos el modal de registro

export default function UsuariosTabla() {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [usuarioAEditar, setUsuarioAEditar] = useState(null); // Estado para controlar qué usuario editar

  useEffect(() => {
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados);
  }, []);

  // Función para eliminar usuario por id
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este usuario?")) {
      const usuariosActualizados = usuarios.filter((user) => user.id !== id);
      localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
      setUsuarios(usuariosActualizados);
    }
  };

  // Función para abrir el modal
  const abrirModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setIsModalOpen(false);
    setUsuarioAEditar(null); // Resetear el usuario a editar cuando se cierra el modal
  };

  // Función para editar un usuario
  const editarUsuario = (usuario) => {
    setUsuarioAEditar(usuario); // Establecer el usuario que se desea editar
    abrirModal(); // Abrir el modal
  };

  // Función para actualizar la lista de usuarios después de registrar o editar
  const actualizarUsuarios = () => {
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados); // Actualiza el estado con la nueva lista de usuarios
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-center">
          Usuarios Registrados
        </h2>
        <button
          onClick={abrirModal} // Abre el modal
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          title="Adicionar usuario"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {usuarios.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay usuarios registrados.
        </p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
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
              <th className="border border-gray-300 px-4 py-2">Dirección</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-100">
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
                  <button
                    onClick={() => editarUsuario(user)} // Abre el modal con el usuario seleccionado
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
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
      )}

      {/* Modal de Registro */}
      <ModalRegistro
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onRegister={actualizarUsuarios} // Pasa la función que actualiza la lista
        usuario={usuarioAEditar} // Pasa el usuario para editar si existe
      />
    </div>
  );
}
