import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaTags } from "react-icons/fa";
import { MdOutlineAttachMoney, MdNumbers } from "react-icons/md";

export default function ModalProducto({
  isOpen,
  onClose,
  onRegister,
  producto,
}) {
  const [f, sF] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });
  const [err, sE] = useState({});
  const [edit, sEdit] = useState(false);

  // Regex y validadores
  const rgxLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const rgxNum = /^[0-9]+(\.[0-9]+)?$/;

  useEffect(() => {
    if (producto) {
      sF({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        stock: producto.stock,
      });
      sEdit(true);
      sE({});
    } else {
      sF({ nombre: "", categoria: "", precio: "", stock: "" });
      sEdit(false);
    }
  }, [producto]);

  const vCampo = (n, v) => {
    let e = "";
    switch (n) {
      case "nombre":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!rgxLetras.test(v)) e = "Solo letras y espacios.";
        break;
      case "categoria":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!rgxLetras.test(v)) e = "Solo letras y espacios.";
        break;
      case "precio":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!rgxNum.test(v) || parseFloat(v) <= 0)
          e = "Debe ser un número positivo.";
        break;
      case "stock":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!/^[0-9]+$/.test(v) || parseInt(v) < 0)
          e = "Debe ser un número entero positivo.";
        break;
      default:
        break;
    }
    return e;
  };

  const c = (e) => {
    const { name, value } = e.target;
    sF({ ...f, [name]: value });
    sE({ ...err, [name]: vCampo(name, value) });
  };

  const vForm = () => {
    const e = {};
    Object.keys(f).forEach((k) => {
      const er = vCampo(k, f[k]);
      if (er) e[k] = er;
    });
    sE(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!vForm()) return;

    const prodNuevo = {
      id: edit ? producto.id : Date.now(),
      nombre: f.nombre.trim(),
      categoria: f.categoria.trim(),
      precio: parseFloat(f.precio),
      stock: parseInt(f.stock),
    };

    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    const final = edit
      ? guardados.map((p) => (p.id === producto.id ? prodNuevo : p))
      : [...guardados, prodNuevo];

    localStorage.setItem("productos", JSON.stringify(final));
    onRegister();
    onClose();
  };

  if (!isOpen) return null;

  const campos = [
    { name: "nombre", placeholder: "Nombre del Producto", icon: <FaBoxOpen /> },
    { name: "categoria", placeholder: "Categoría", icon: <FaTags /> },
    {
      name: "precio",
      placeholder: "Precio",
      type: "number",
      icon: <MdOutlineAttachMoney />,
    },
    {
      name: "stock",
      placeholder: "Stock",
      type: "number",
      icon: <MdNumbers />,
    },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-10 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {edit ? "Editar Producto" : "Agregar Producto"}
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 gap-6">
          {campos.map((cpo, i) => (
            <div key={i}>
              <div
                className={`flex items-center border-b-2 pb-2 ${
                  err[cpo.name] ? "border-red-500" : "border-gray-300"
                }`}
              >
                <input
                  type={cpo.type || "text"}
                  placeholder={cpo.placeholder}
                  name={cpo.name}
                  value={f[cpo.name]}
                  onChange={c}
                  className={`w-full bg-transparent outline-none placeholder-gray-600 text-gray-800 ${
                    err[cpo.name] ? "text-red-600" : ""
                  }`}
                  required
                />
                <span
                  className={`text-2xl ml-3 ${
                    err[cpo.name] ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {cpo.icon}
                </span>
              </div>
              {err[cpo.name] && (
                <p className="text-red-600 text-sm mt-1">{err[cpo.name]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              {edit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
