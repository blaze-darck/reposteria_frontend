import React, { useState, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineDateRange, MdOutlineAttachMoney } from "react-icons/md";
import { TbClipboardText } from "react-icons/tb";

export default function ModalPedidos({ isOpen, onClose, onRegister, pedido }) {
  const [f, sF] = useState({
    cliente: "",
    detalle: "",
    precio: "",
    fecha: "",
  });
  const [err, sE] = useState({});
  const [edit, sEdit] = useState(false);

  const letrasRgx = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const numRgx = /^[0-9]+(\.[0-9]+)?$/;

  useEffect(() => {
    if (pedido) {
      sF({
        cliente: pedido.cliente,
        detalle: pedido.detalle_pedido,
        precio: pedido.precio_total,
        fecha: pedido.fecha_entrega,
      });
      sEdit(true);
      sE({});
    } else {
      sF({ cliente: "", detalle: "", precio: "", fecha: "" });
      sEdit(false);
    }
  }, [pedido]);

  const validarCampo = (n, v) => {
    let e = "";
    switch (n) {
      case "cliente":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!letrasRgx.test(v)) e = "Solo letras y espacios.";
        break;
      case "detalle":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (v.length < 5) e = "Debe tener al menos 5 caracteres.";
        break;
      case "precio":
        if (!v.trim()) e = "Campo obligatorio.";
        else if (!numRgx.test(v) || parseFloat(v) <= 0)
          e = "Debe ser un número positivo.";
        break;
      case "fecha":
        if (!v) e = "Campo obligatorio.";
        else {
          const hoy = new Date();
          const fSel = new Date(v);
          if (fSel < hoy.setHours(0, 0, 0, 0))
            e = "No puede ser una fecha pasada.";
        }
        break;
      default:
        break;
    }
    return e;
  };

  const c = (e) => {
    const { name, value } = e.target;
    sF({ ...f, [name]: value });
    sE({ ...err, [name]: validarCampo(name, value) });
  };

  const validarForm = () => {
    const e = {};
    Object.keys(f).forEach((k) => {
      const er = validarCampo(k, f[k]);
      if (er) e[k] = er;
    });
    sE(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    const nuevo = {
      id: edit ? pedido.id : Date.now(),
      cliente: f.cliente.trim(),
      detalle_pedido: f.detalle.trim(),
      precio_total: parseFloat(f.precio),
      fecha_entrega: f.fecha,
    };

    const guardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    const nuevos = edit
      ? guardados.map((p) => (p.id === pedido.id ? nuevo : p))
      : [...guardados, nuevo];

    localStorage.setItem("pedidos", JSON.stringify(nuevos));
    onRegister();
    onClose();
  };

  if (!isOpen) return null;

  const campos = [
    { name: "cliente", placeholder: "Cliente", icon: <FaUserTie /> },
    {
      name: "detalle",
      placeholder: "Detalle del Pedido",
      icon: <TbClipboardText />,
      textarea: true,
    },
    {
      name: "precio",
      placeholder: "Precio Total",
      icon: <MdOutlineAttachMoney />,
      type: "number",
    },
    {
      name: "fecha",
      placeholder: "Fecha de Entrega",
      icon: <MdOutlineDateRange />,
      type: "date",
    },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-10 z-10 animate-fade-in">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {edit ? "Editar Pedido" : "Registrar Pedido"}
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 gap-6">
          {campos.map((cpo, i) => (
            <div key={i}>
              <div
                className={`flex items-center border-b-2 pb-2 ${
                  err[cpo.name] ? "border-red-500" : "border-gray-300"
                }`}
              >
                {cpo.textarea ? (
                  <textarea
                    name={cpo.name}
                    placeholder={cpo.placeholder}
                    value={f[cpo.name]}
                    onChange={c}
                    className={`w-full bg-transparent outline-none placeholder-gray-600 text-gray-800 resize-none h-20 ${
                      err[cpo.name] ? "text-red-600" : ""
                    }`}
                    required
                  />
                ) : (
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
                )}
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
              className="bg- text-white px-10 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
            >
              {edit ? "Actualizar Pedido" : "Registrar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
