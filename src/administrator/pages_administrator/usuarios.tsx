import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineX,
  HiOutlineUserGroup,
} from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  roles?: Rol[];
}

interface Rol {
  id: number;
  nombre: string;
}

export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
  });

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3000/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.log("Error cargando usuarios", error);
      }
    };

    const cargarRoles = async () => {
      try {
        const res = await fetch("http://localhost:3000/roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.log("Error cargando roles", error);
      }
    };

    cargarUsuarios();
    cargarRoles();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      contrasena: "",
    });
    setRolesSeleccionados([]);
    setShowModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      correo: usuario.correo,
      contrasena: "",
    });
    setRolesSeleccionados(usuario.roles?.map((r) => r.id) || []);
    setShowModal(true);
  };

  const handleSave = () => {
    const url = editingId
      ? `http://localhost:3000/usuarios/${editingId}`
      : "http://localhost:3000/usuarios";

    const method = editingId ? "PUT" : "POST";
    const body = { ...form, rolesIds: rolesSeleccionados };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((usuarioGuardado) => {
        if (editingId) {
          setUsuarios(
            usuarios.map((u) => (u.id === editingId ? usuarioGuardado : u))
          );
        } else {
          setUsuarios([...usuarios, usuarioGuardado]);
        }
        setShowModal(false);
      })
      .catch((err) => console.error("Error guardando usuario:", err));
  };

  const toggleRol = (rolId: number) => {
    setRolesSeleccionados((prev) =>
      prev.includes(rolId)
        ? prev.filter((id) => id !== rolId)
        : [...prev, rolId]
    );
  };

  return (
    <div className="p-6 ">
      <div className="mb-4 flex justify-between items-center ">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg_fondo text-white px-4 py-2 rounded-lg hover:bg-[#9e4e2f] transition-colors shadow-md"
        >
          <HiOutlinePlus size={18} />
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-primario font-black text-black">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Ap. Paterno</th>
              <th className="px-6 py-3">Ap. Materno</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-b hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-3">{usuario.nombre}</td>
                <td className="px-6 py-3">{usuario.apellidoPaterno}</td>
                <td className="px-6 py-3">{usuario.apellidoMaterno}</td>
                <td className="px-6 py-3">{usuario.correo}</td>

                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-pink-600 hover:text-pink-800 mr-3 transition-colors"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg_fondo text-black p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-black hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <HiOutlineX size={24} />
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <HiOutlineUser size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingId ? "Editar Usuario" : "Nuevo Usuario"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {editingId
                      ? "Actualiza la información del usuario"
                      : "Completa los datos para crear un nuevo usuario"}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Información Personal */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HiOutlineUser className="text-[#d88c6f]" />
                  Información Personal
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el nombre"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d88c6f] focus:border-transparent outline-none transition-all"
                      value={form.nombre}
                      onChange={(e) =>
                        setForm({ ...form, nombre: e.target.value })
                      }
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el apellido"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d88c6f] focus:border-transparent outline-none transition-all"
                      value={form.apellidoPaterno}
                      onChange={(e) =>
                        setForm({ ...form, apellidoPaterno: e.target.value })
                      }
                    />
                  </div>

                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el apellido"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d88c6f] focus:border-transparent outline-none transition-all"
                      value={form.apellidoMaterno}
                      onChange={(e) =>
                        setForm({ ...form, apellidoMaterno: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HiOutlineLockClosed className="text-[#d88c6f]" />
                  Credenciales de Acceso
                </h4>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <HiOutlineMail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d88c6f] focus:border-transparent outline-none transition-all"
                        value={form.correo}
                        onChange={(e) =>
                          setForm({ ...form, correo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña{" "}
                      {editingId && (
                        <span className="text-gray-500 text-xs">
                          (dejar en blanco para mantener la actual)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d88c6f] focus:border-transparent outline-none transition-all"
                        value={form.contrasena}
                        onChange={(e) =>
                          setForm({ ...form, contrasena: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HiOutlineUserGroup className="text-[#d88c6f]" />
                  Roles y Permisos
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map((rol) => (
                    <button
                      key={rol.id}
                      type="button"
                      onClick={() => toggleRol(rol.id)}
                      className={`
                        px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                        ${
                          rolesSeleccionados.includes(rol.id)
                            ? "border-[#fb6f92] bg-[#fb6f92] text-white shadow-md"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#fb6f92] hover:bg-[#fb6f92]/5"
                        }
                      `}
                    >
                      {rol.nombre}
                    </button>
                  ))}
                </div>

                {rolesSeleccionados.length === 0 && (
                  <p className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                    <span>⚠️</span> Selecciona al menos un rol
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg_fondo text-white rounded-lg hover:shadow-lg transition-all font-medium"
                onClick={handleSave}
              >
                {editingId ? "Actualizar Usuario" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosTable;
