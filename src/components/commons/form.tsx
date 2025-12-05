import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function RegistroUsuarios() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [correoVerificacion, setCorreoVerificacion] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      if (!soloLetras.test(value)) {
        setError(`El campo ${name} solo puede contener letras`);
        return;
      } else {
        setError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const verificarCodigo = async () => {
    if (!codigo.trim()) {
      setError("Debes ingresar un código");
      return;
    }

    try {
      const API_URL = "http://10.226.35.58:3000/usuarios/verificar-codigo";

      const response = await axios.post(API_URL, {
        correo: correoVerificacion,
        codigo: codigo,
      });

      alert("Cuenta verificada correctamente ahora puedes iniciar sesión");
      setShowModal(false);
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al verificar el código");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!soloLetras.test(formData.nombre))
      return setError("El nombre solo puede contener letras");
    if (!soloLetras.test(formData.apellidoPaterno))
      return setError("El apellido paterno solo puede contener letras");
    if (!soloLetras.test(formData.apellidoMaterno))
      return setError("El apellido materno solo puede contener letras");

    if (formData.contrasena.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres");

    if (formData.contrasena !== formData.confirmarContrasena)
      return setError("Las contraseñas no coinciden");

    try {
      setLoading(true);

      const API_URL = "http://10.226.35.58:3000/usuarios";

      await axios.post(API_URL, {
        correo: formData.correo,
        contrasena: formData.contrasena,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rolesIds: [2],
      });

      setCorreoVerificacion(formData.correo);

      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center border-4 border-cyan-600">
            <h2 className="text-2xl font-bold mb-4 text-cyan-700">
              Verificación de Correo
            </h2>

            <p className="text-gray-700 mb-4">
              Ingresa el código de 6 dígitos enviado a:
              <br />
              <strong>{correoVerificacion}</strong>
            </p>

            {error && (
              <p className="text-red-600 font-semibold mb-2">{error}</p>
            )}

            <input
              type="text"
              maxLength={6}
              placeholder="Código de verificación"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border-2 border-cyan-600 p-2 rounded mb-4 text-center text-xl tracking-widest"
            />

            <button
              onClick={verificarCodigo}
              className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 font-semibold"
            >
              Verificar Código
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 text-gray-600 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <div
        className="w-full min-h-screen flex items-center justify-center p-6 overflow-auto bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/public/wallysuma.png')",
          backgroundColor: "#f0f9ff",
        }}
      >
        <div
          className="relative z-10 w-full max-w-4xl bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8 my-6"
          style={{ borderRadius: "2px" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black-900 mb-2">
              REGISTRO DE USUARIOS
            </h2>
            <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
          </div>

          {error && !showModal && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Nombre */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <FaUser className="text-2xl text-cyan-600 mr-3" />
              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            {/* Apellido Paterno */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <FaUser className="text-2xl text-cyan-600 mr-3" />
              <input
                type="text"
                placeholder="Apellido Paterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            {/* Apellido Materno */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <FaUser className="text-2xl text-cyan-600 mr-3" />
              <input
                type="text"
                placeholder="Apellido Materno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            {/* Correo */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <FaEnvelope className="text-2xl text-cyan-600 mr-3" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3" />
              <input
                type="password"
                placeholder="Contraseña"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="flex items-center border-b-4 border-cyan-600 pb-3">
              <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3" />
              <input
                type="password"
                placeholder="Confirme Contraseña"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-600 text-white px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 transition-all font-bold text-lg disabled:opacity-50"
              >
                {loading ? "Registrando..." : "REGISTRARSE"}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 pt-6 border-t-2 border-black-900 text-black-900 font-semibold">
            ¿Ya tienes cuenta?
            <button
              onClick={() => navigate("/login")}
              className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
