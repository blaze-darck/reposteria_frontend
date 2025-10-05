import React from "react";

interface Usuario {
  nombre: string;
  email: string;
  password: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({ usuarios }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Usuarios Registrados</h2>
      <table className="min-w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Nombre</th>
            <th className="border-b p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td className="border-b p-2">{usuario.nombre}</td>
              <td className="border-b p-2">{usuario.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;
