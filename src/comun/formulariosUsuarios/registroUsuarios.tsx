import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { LiaAddressCardSolid } from "react-icons/lia";
import { MdOutlineDateRange, MdOutlineMailOutline } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

export default function RegistroUsuarios() {
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "nombre":
      case "apellido_paterno":
      case "apellido_materno":
        if (!value.trim()) error = "Campo obligatorio.";
        else if (!nameRegex.test(value))
          error = "Solo se permiten letras y espacios.";
        break;

      case "correo_electronico":
        if (!value.trim()) error = "El correo es obligatorio.";
        else if (!emailRegex.test(value)) error = "El formato no es válido.";
        break;

      case "fecha_nacimiento":
        if (!value) error = "Campo obligatorio.";
        else {
          const fecha = new Date(value);
          const hoy = new Date();
          const hace60Anios = new Date();
          hace60Anios.setFullYear(hoy.getFullYear() - 60);

          if (fecha > hoy) error = "La fecha no puede ser futura.";
          else if (fecha < hace60Anios)
            error = "La edad no puede ser mayor de 60 años.";
        }
        break;

      case "direccion":
        if (!value.trim()) error = "La dirección es obligatoria.";
        break;

      case "contraseña":
        if (!value) error = "Campo obligatorio.";
        else if (!passwordRegex.test(value))
          error =
            "Debe tener al menos 8 caracteres e incluir letras y números.";
        break;

      case "confirmarContraseña":
        if (value !== formData.contraseña)
          error = "Las contraseñas no coinciden.";
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    const newError = validateField(name, value);

    setErrors({
      ...errors,
      [name]: newError,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    Object.keys(formData).forEach((key) => {
      const value = (formData as any)[key];
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const correoExistente = usuariosGuardados.find(
      (u: any) => u.correo_electronico === formData.correo_electronico
    );
    if (correoExistente) {
      setErrors({
        ...errors,
        correo_electronico: "Este correo ya está registrado.",
      });
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      ...formData,
      rol: "usuario", // Aquí defines el rol por defecto al registrar
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

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

    if (nuevoUsuario.rol === "administrador") {
      navigate("/panelControl");
    } else {
      navigate("/usuarioHome");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#E6B8B8] p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 border-t-8 border-[#D4AF37]">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#5A3825]">
          DULCE TENTACIÓN
        </h2>
        <h3 className="text-2xl font-semibold text-center mb-8 text-[#5A3825]">
          REGISTRO DE USUARIOS
        </h3>

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
          ].map((campo, i) => (
            <div key={i}>
              <div
                className={`flex items-center border-b-2 pb-2 ${
                  errors[campo.name] ? "border-red-500" : "border-[#5A3825]"
                }`}
              >
                <input
                  type={campo.type || "text"}
                  placeholder={campo.placeholder}
                  name={campo.name}
                  value={(formData as any)[campo.name]}
                  onChange={handleChange}
                  className={`w-full bg-transparent outline-none placeholder-[#5A3825] text-[#5A3825] ${
                    errors[campo.name] ? "text-red-600" : ""
                  }`}
                  required
                />
                <span
                  className={`text-2xl ml-3 ${
                    errors[campo.name] ? "text-red-500" : "text-[#5A3825]"
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

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-accent text-[#E6B8B8] px-8 py-3 rounded-lg font-semibold 
              hover:bg-[#3E2618] hover:text-[#D4AF37] transition-all duration-300 shadow-md"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
