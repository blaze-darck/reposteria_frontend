import React from "react";

// Definir el tipo de usuario
interface Usuario {
  nombre: string;
  email: string;
  password: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  editarUsuario: (usuario: Usuario, index: number) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  editarUsuario,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Usuarios Registrados</h2>
      <table className="min-w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Nombre</th>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">Password</th>
            <th className="border-b p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td className="border-b p-2">{usuario.nombre}</td>
              <td className="border-b p-2">{usuario.email}</td>
              <td className="border-b p-2">{usuario.password}</td>
              <td className="border-b p-2">
                <button
                  onClick={() => editarUsuario(usuario, index)}
                  className="bg-yellow-500 text-white p-1 rounded"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;
