import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import ModalPedidos from "./modalPedidos";

export default function PedidosTabla() {
  const [pedidos, setPedidos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoAEditar, setPedidoAEditar] = useState(null);

  // Cargar pedidos desde localStorage al montar el componente
  useEffect(() => {
    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(pedidosGuardados);
  }, []);

  // Eliminar pedido
  const eliminarPedido = (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este pedido?")) {
      const pedidosActualizados = pedidos.filter((pedido) => pedido.id !== id);
      localStorage.setItem("pedidos", JSON.stringify(pedidosActualizados));
      setPedidos(pedidosActualizados);
    }
  };

  // Abrir modal
  const abrirModal = () => {
    setIsModalOpen(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setIsModalOpen(false);
    setPedidoAEditar(null);
  };

  // Editar pedido
  const editarPedido = (pedido) => {
    setPedidoAEditar(pedido);
    abrirModal();
  };

  // Actualizar la lista después de registrar o editar
  const actualizarPedidos = () => {
    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(pedidosGuardados);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-center">
          Pedidos Registrados
        </h2>
        <button
          onClick={abrirModal}
          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          title="Adicionar pedido"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-600">No hay pedidos registrados.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Cliente</th>
              <th className="border border-gray-300 px-4 py-2">
                Detalle del Pedido
              </th>
              <th className="border border-gray-300 px-4 py-2">Precio Total</th>
              <th className="border border-gray-300 px-4 py-2">
                Fecha de Entrega
              </th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="text-center hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {pedido.cliente}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pedido.detalle_pedido}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${parseFloat(pedido.precio_total).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pedido.fecha_entrega}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => editarPedido(pedido)}
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                    title="Editar pedido"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => eliminarPedido(pedido.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar pedido"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para registrar o editar pedidos */}
      <ModalPedidos
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onRegister={actualizarPedidos}
        pedido={pedidoAEditar}
      />
    </div>
  );
}
