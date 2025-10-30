import React, { useState, useEffect } from "react";

export default function ModalPedidos({
  isOpen,
  onClose,
  onRegister,
  pedido = null,
}) {
  const [cliente, setCliente] = useState("");
  const [detallePedido, setDetallePedido] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (pedido) {
      setCliente(pedido.cliente);
      setDetallePedido(pedido.detalle_pedido);
      setPrecioTotal(pedido.precio_total);
      setFechaEntrega(pedido.fecha_entrega);
      setIsEditing(true);
    } else {
      setCliente("");
      setDetallePedido("");
      setPrecioTotal("");
      setFechaEntrega("");
      setIsEditing(false);
    }
  }, [pedido]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cliente || !detallePedido || !precioTotal || !fechaEntrega) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevoPedido = {
      id: isEditing ? pedido.id : Date.now(),
      cliente,
      detalle_pedido: detallePedido,
      precio_total: parseFloat(precioTotal),
      fecha_entrega: fechaEntrega,
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (isEditing) {
      const pedidosActualizados = pedidosGuardados.map((p) =>
        p.id === pedido.id ? nuevoPedido : p
      );
      localStorage.setItem("pedidos", JSON.stringify(pedidosActualizados));
    } else {
      pedidosGuardados.push(nuevoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
    }

    onRegister();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute w-[500px] h-[650px] bg-gray-700 bg-opacity-50 rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm relative z-10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {isEditing ? "Editar Pedido" : "Agregar Pedido"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cliente</label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Detalle del Pedido
            </label>
            <textarea
              value={detallePedido}
              onChange={(e) => setDetallePedido(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Precio Total</label>
            <input
              type="number"
              value={precioTotal}
              onChange={(e) => setPrecioTotal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Fecha de Entrega</label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              {isEditing ? "Actualizar Pedido" : "Agregar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
