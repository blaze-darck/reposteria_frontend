import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [correoLogin, setCorreoLogin] = useState("");
  const [contrasenaLogin, setContrasenaLogin] = useState("");

  // Estados para el modal de verificación
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: correoLogin,
        contrasena: contrasenaLogin,
      });

      const { usuario, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));
      console.log("Usuario actual:", usuario);

      // Mapa flexible de rutas por rol
      const rutasPorRol: Record<string, string> = {
        Administrador: "/administrator/usuarios",
        Usuario: "/",
        Cocinero: "/pedidos",
        Cajero: "/cajero",
      };

      // Buscar el primer rol que tenga una ruta asignada
      const rolAsignado = usuario.roles.find((rol: string) => rutasPorRol[rol]);

      if (rolAsignado) {
        navigate(rutasPorRol[rolAsignado]);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(`El campo ${name} solo puede contener letras`);
        return;
      } else setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  // Función para verificar el código de 6 dígitos
  const verificarCodigo = async () => {
    if (!codigo.trim()) {
      setError("Debes ingresar un código");
      return;
    }

    try {
      const API_URL = "http://localhost:3000/usuarios/verificar-codigo";

      const response = await axios.post(API_URL, {
        correo: correoVerificacion,
        codigo: codigo,
      });

      alert("Cuenta verificada correctamente, ahora puedes iniciar sesión");
      setShowModal(false);
      setCodigo("");
      setError("");
      setIsLogin(true); // Cambia a la vista de login
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al verificar el código");
      }
    }
  };

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validaciones
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(formData.nombre)) {
      setError("El nombre solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoPaterno)) {
      setError("El apellido paterno solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoMaterno)) {
      setError("El apellido materno solo puede contener letras");
      return;
    }
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/usuarios", {
        correo: formData.correo,
        contrasena: formData.contrasena,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rolesIds: [2],
      });

      // Guardar correo y mostrar modal de verificación
      setCorreoVerificacion(formData.correo);
      setShowModal(true);

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
      });
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal de Verificación de Correo */}
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
              onClick={() => {
                setShowModal(false);
                setError("");
                setCodigo("");
              }}
              className="mt-3 text-gray-600 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Login/Registro */}
      <div
        className="w-full min-h-screen flex items-center justify-center p-6 overflow-auto bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/public/dulce_tentacion.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-[#FFA07A]/10 backdrop-blur-sm"></div>
        <div
          className={`relative z-10 w-full ${
            isLogin ? "max-w-md" : "max-w-4xl"
          } 
          bg-white/50 backdrop-blur-sm border-4 border-black-900 shadow-2xl p-8 my-6`}
          style={{ borderRadius: "16px" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black-900 mb-2">
              {isLogin ? "INICIAR SESIÓN" : "REGISTRO DE USUARIOS"}
            </h2>
            <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
          </div>

          {error && !showModal && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
                  <MdOutlineMailOutline className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    value={correoLogin}
                    onChange={(e) => setCorreoLogin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
                  <RiLockPasswordLine className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    value={contrasenaLogin}
                    onChange={(e) => setContrasenaLogin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-cyan-600 text-white px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:bg-gray-400 disabled:border-gray-500"
                  style={{ borderRadius: "16px" }}
                >
                  {loading ? "CARGANDO..." : "ENTRAR"}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-black-900 text-center">
                <p className="text-black-900 font-semibold">
                  ¿No tienes cuenta?
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-bold ml-2 hover:underline"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <>
              <form
                onSubmit={handleRegistro}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Apellido Paterno"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Apellido Materno"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <FaEnvelope className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="flex items-center border-b-4 border-cyan-600 pb-3">
                  <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
                  <input
                    type="password"
                    placeholder="Confirme Contraseña"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none placeholder-black-800 text-black-950 font-medium"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-cyan-600 text-gray-50 px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50"
                    style={{ borderRadius: "2px" }}
                  >
                    {loading ? "Registrando..." : "REGISTRARSE"}
                  </button>
                </div>
              </form>

              <div className="w-full flex justify-center mt-6">
                <p className="text-black-900 font-semibold text-center">
                  ¿Ya tienes cuenta?
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
