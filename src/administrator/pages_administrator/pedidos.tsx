import { useState, useEffect } from "react";
import {
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineShoppingBag,
} from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

interface DetallePedido {
  id: number;
  producto: {
    id: number;
    nombre: string;
    precio: string;
  };
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
}

interface Pedido {
  id: number;
  numeroPedido: string;
  cliente: Usuario;
  fechaPedido: string;
  estado: string;
  metodoPago: string;
  tipoEntrega: string;
  total: string;
  notas?: string;
  detalles: DetallePedido[];
}

const API_URL = "http://localhost:3000";

const api = {
  async getPedidosPendientes(): Promise<Pedido[]> {
    const response = await fetch(`${API_URL}/pedidos?estado=PENDIENTE`);
    if (!response.ok) throw new Error("Error al cargar pedidos");
    const data = await response.json();
    return data.datos || data;
  },

  async actualizarEstadoPedido(pedidoId: number, nuevoEstado: string) {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!response.ok) throw new Error("Error al actualizar pedido");
    return response.json();
  },
};

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error";
  } | null>(null);

  useEffect(() => {
    cargarPedidos();

    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await api.getPedidosPendientes();
      setPedidos(data);
    } catch (error: any) {
      console.error("Error al cargar pedidos:", error);
      mostrarMensaje("Error al cargar pedidos pendientes", "error");
    } finally {
      setLoading(false);
    }
  };

  const marcarComoAceptado = async (pedidoId: number) => {
    try {
      setActualizando(pedidoId);
      await api.actualizarEstadoPedido(pedidoId, "ACEPTADO");
      mostrarMensaje("Pedido aceptado exitosamente", "success");
      await cargarPedidos();
    } catch (error: any) {
      console.error("Error al actualizar pedido:", error);
      mostrarMensaje("Error al actualizar el pedido", "error");
    } finally {
      setActualizando(null);
    }
  };

  const mostrarMensaje = (texto: string, tipo: "success" | "error") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">
            Cargando pedidos pendientes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HiOutlineClock className="text-pink-500" size={36} />
              Pedidos Pendientes
              <span className="bg-pink-500 text-black px-4 py-1 rounded-full text-xl">
                {pedidos.length}
              </span>
            </h1>
            <button
              onClick={cargarPedidos}
              disabled={loading}
              className="flex items-center gap-2 bg-pink-500 text-black px-4 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition"
            >
              <HiOutlineRefresh
                size={20}
                className={loading ? "animate-spin" : ""}
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Mensaje de notificación */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 font-semibold ${
              mensaje.tipo === "success"
                ? "bg-green-100 text-green-800 border-green-600"
                : "bg-red-100 text-red-800 border-red-600"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Lista de pedidos */}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <HiOutlineShoppingBag
              size={64}
              className="mx-auto mb-4 text-gray-300"
            />
            <p className="text-xl text-gray-500 font-semibold">
              No hay pedidos pendientes
            </p>
            <p className="text-gray-400 mt-2">
              Los nuevos pedidos aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead className="bg-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      N° Pedido
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Productos
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Detalles
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-sm">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-sm w-32">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-orange-50 transition"
                    >
                      {/* Número de pedido */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-orange-600 text-base">
                          #{pedido.numeroPedido.split("-")[2]}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {pedido.cliente.nombre}{" "}
                            {pedido.cliente.apellidoPaterno}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {pedido.cliente.correo}
                          </p>
                        </div>
                      </td>

                      {/* Productos */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 max-w-xs">
                          {pedido.detalles.map((detalle) => (
                            <div key={detalle.id} className="text-xs truncate">
                              <span className="font-medium">
                                {detalle.cantidad}x
                              </span>{" "}
                              {detalle.producto.nombre}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Detalles */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {pedido.metodoPago}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {pedido.tipoEntrega.replace("_", " ")}
                            </span>
                          </div>
                          {pedido.notas && (
                            <div className="mt-1 bg-yellow-50 p-1 rounded border border-yellow-200 max-w-xs">
                              <p
                                className="text-xs text-yellow-800 truncate"
                                title={pedido.notas}
                              >
                                {pedido.notas}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <p className="text-lg font-bold text-orange-600">
                          Bs. {parseFloat(pedido.total).toFixed(2)}
                        </p>
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {formatearFecha(pedido.fechaPedido)}
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => marcarComoAceptado(pedido.id)}
                          disabled={actualizando === pedido.id}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition flex items-center gap-1 mx-auto font-semibold text-sm whitespace-nowrap"
                        >
                          <HiOutlineCheck size={16} />
                          {actualizando === pedido.id ? "..." : "Aceptar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
