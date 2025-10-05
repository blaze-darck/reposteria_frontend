import React, { useState, useEffect, FormEvent } from "react";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import Modal from "./Modal";
import UsuariosTable from "./TablaUsuarios";

// Definir el tipo para un usuario
interface Usuario {
  nombre: string;
  email: string;
  password: string;
}

const Navbar: React.FC = () => {
  const [modalRegistroAbierto, setModalRegistroAbierto] =
    useState<boolean>(false);
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Abre y cierra el modal de registro
  const abrirModalRegistro = () => setModalRegistroAbierto(true);
  const cerrarModalRegistro = () => setModalRegistroAbierto(false);

  // Al montar el componente, cargar usuarios desde el localStorage
  useEffect(() => {
    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    ) as Usuario[];
    setUsuarios(usuariosGuardados);
  }, []);

  // Manejar el envío del formulario de registro
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre,
      email,
      password,
    };

    // Guardar el nuevo usuario en el localStorage
    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    ) as Usuario[];
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Actualizar el estado con los usuarios guardados
    setUsuarios(usuariosGuardados);

    // Limpiar el formulario
    setNombre("");
    setEmail("");
    setPassword("");
    setConfirmarPassword("");

    // Cerrar el modal
    cerrarModalRegistro();
  };

  return (
    <div className="pt-4 bg-white top-0 sticky shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold cursor-pointer">
            PASTELERÍA LA ROSITA
          </h1>
          <div className="flex gap-4 md:gap-8 items-center">
            <div className="md:flex items-center gap-3 hidden">
              {/* Ícono para iniciar sesión */}
              <div className="rounded-full border-2 border-gray-300 text-gray-500 text-3xl w-15 h-15 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-200">
                <AiOutlineUser />
              </div>
              {/* Botón para registrarse con ícono */}
              <button
                onClick={abrirModalRegistro}
                className="rounded-full border-2 border-gray-300 text-gray-500 text-3xl w-15 h-15 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-200"
              >
                <AiOutlineUserAdd />
              </button>
            </div>

            {/* Ícono del carrito */}
            <div className="text-gray-500 text-3xl relative cursor-pointer">
              <FiShoppingCart />
              <div className="absolute -top-3 -right-2 bg-red-500 w-5 h-5 rounded-full text-white flex items-center justify-center text-sm">
                0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      <Modal
        estaAbierto={modalRegistroAbierto}
        estaCerrado={cerrarModalRegistro}
      >
        <h2 className="text-xl font-semibold mb-2">Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="nombre" className="block">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              className="w-full border p-2 mt-2"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="email-registro" className="block">
              Email
            </label>
            <input
              type="email"
              id="email-registro"
              className="w-full border p-2 mt-2"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password-registro" className="block">
              Contraseña
            </label>
            <input
              type="password"
              id="password-registro"
              className="w-full border p-2 mt-2"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="confirmar-password" className="block">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmar-password"
              className="w-full border p-2 mt-2"
              placeholder="********"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Registrarse
          </button>
        </form>
      </Modal>

      <div className="border-b border-gray-200 pt-4"></div>

      <UsuariosTable usuarios={usuarios} />
    </div>
  );
};

export default Navbar;
