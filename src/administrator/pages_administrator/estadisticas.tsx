import { useState, useEffect } from "react";
import {
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineCash,
  HiOutlineShoppingCart,
  HiOutlineDocumentReport,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

// Interfaces
interface EstadisticasDelDia {
  fecha: string;
  pedidosCompletados: number;
  gananciaTotal: number;
  porMetodoPago: { metodo: string; cantidad: number; total: number }[];
  porTipoEntrega: { tipo: string; cantidad: number }[];
}

interface ProductoMasVendido {
  productoId: number;
  nombre: string;
  precio: number;
  cantidadVendida: number;
  totalVentas: number;
}

interface VentaPorDia {
  fecha: string;
  cantidadPedidos: number;
  totalVentas: number;
}

interface Reporte {
  periodo: { inicio: string; fin: string };
  resumen: {
    totalPedidos: number;
    ventasTotales: number;
    ticketPromedio: number;
  };
  productosMasVendidos: ProductoMasVendido[];
  ventasPorDia: VentaPorDia[];
  metodoPago: { metodo: string; cantidad: number; total: number }[];
}

const API_URL = "http://localhost:3000";

const api = {
  async getEstadisticasDelDia(): Promise<EstadisticasDelDia> {
    console.log("📡 Llamando a:", `${API_URL}/pedidos/estadisticas/dia`);
    const response = await fetch(`${API_URL}/pedidos/estadisticas/dia`);
    console.log("📥 Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);
    return data.datos;
  },

  async getProductosMasVendidos(limite = 10): Promise<ProductoMasVendido[]> {
    console.log("📡 Llamando a productos más vendidos, límite:", limite);
    const response = await fetch(
      `${API_URL}/pedidos/estadisticas/productos-mas-vendidos?limite=${limite}`
    );
    console.log("📥 Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Productos recibidos:", data);
    return data.datos;
  },

  async getReporte(fechaInicio?: string, fechaFin?: string): Promise<Reporte> {
    let url = `${API_URL}/pedidos/estadisticas/reporte`;
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    if (params.toString()) url += `?${params.toString()}`;

    console.log("📡 Llamando a:", url);
    const response = await fetch(url);
    console.log("📥 Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Reporte recibido:", data);
    return data.datos;
  },
};

export function Estadisticas() {
  const [estadisticasDelDia, setEstadisticasDelDia] =
    useState<EstadisticasDelDia | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    ProductoMasVendido[]
  >([]);
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [vistaActual, setVistaActual] = useState<
    "hoy" | "productos" | "reporte"
  >("hoy");

  useEffect(() => {
    console.log("🚀 Componente montado, cargando datos iniciales...");
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log("🔄 Iniciando carga de datos...");
      setLoading(true);
      setError(null);

      const [estadisticas, productos] = await Promise.all([
        api.getEstadisticasDelDia(),
        api.getProductosMasVendidos(10),
      ]);

      console.log("✅ Datos cargados exitosamente");
      console.log("Estadísticas:", estadisticas);
      console.log("Productos:", productos);

      setEstadisticasDelDia(estadisticas);
      setProductosMasVendidos(productos);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const generarReporte = async () => {
    try {
      console.log("📊 Generando reporte...");
      console.log("Fecha inicio:", fechaInicio);
      console.log("Fecha fin:", fechaFin);

      setLoading(true);
      setError(null);

      const reporteData = await api.getReporte(fechaInicio, fechaFin);
      console.log("✅ Reporte generado:", reporteData);

      setReporte(reporteData);
      setVistaActual("reporte");
    } catch (error) {
      console.error("❌ Error al generar reporte:", error);
      setError(
        error instanceof Error ? error.message : "Error al generar reporte"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearMoneda = (cantidad: number) => {
    return `Bs. ${cantidad.toFixed(2)}`;
  };

  // Pantalla de carga inicial
  if (loading && !estadisticasDelDia) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">
            Cargando estadísticas...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Conectando con API en {API_URL}
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error && !estadisticasDelDia) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <HiOutlineExclamationCircle
            className="text-red-500 mx-auto mb-4"
            size={64}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm font-mono text-gray-700">
              <strong>Verificar:</strong>
              <br />
              1. API corriendo en: {API_URL}
              <br />
              2. Endpoint disponible: /pedidos/estadisticas/dia
              <br />
              3. CORS configurado correctamente
              <br />
              4. Base de datos conectada
            </p>
          </div>
          <button
            onClick={cargarDatos}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 font-semibold flex items-center gap-2 mx-auto"
          >
            <HiOutlineRefresh size={20} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg_fondo p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-pink-600">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HiOutlineChartBar className="text-pink-600" size={36} />
              Dashboard de Estadísticas
            </h1>
            <button
              onClick={cargarDatos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <HiOutlineRefresh
                size={20}
                className={loading ? "animate-spin" : ""}
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Alerta de error temporal */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <HiOutlineExclamationCircle
                className="text-red-500 mr-3"
                size={24}
              />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pestañas de navegación */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2 flex gap-2">
          <button
            onClick={() => setVistaActual("hoy")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              vistaActual === "hoy"
                ? "bg-pink-300 text-black"
                : "text-black-700 hover:bg-black-100"
            }`}
          >
            <HiOutlineCash size={20} />
            Hoy
          </button>
          <button
            onClick={() => setVistaActual("productos")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              vistaActual === "productos"
                ? "bg-pink-300 text-black"
                : "text-black-700 hover:bg-black-100"
            }`}
          >
            <HiOutlineTrendingUp size={20} />
            Productos
          </button>
          <button
            onClick={() => setVistaActual("reporte")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              vistaActual === "reporte"
                ? "bg-pink-300 text-black"
                : "text-black-700 hover:bg-black-100"
            }`}
          >
            <HiOutlineDocumentReport size={20} />
            Reportes
          </button>
        </div>

        {/* Vista: Estadísticas del Día */}
        {vistaActual === "hoy" && estadisticasDelDia && (
          <div className="space-y-6">
            {/* Cards de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="texto_letras rounded-lg shadow-md p-6 text-black">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">
                    Ganancia del Día
                  </h3>
                  <HiOutlineCash size={32} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold">
                  {formatearMoneda(estadisticasDelDia.gananciaTotal)}
                </p>
              </div>

              <div className="bg-[#BA9C88] rounded-lg shadow-md p-6 text-black">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">
                    Pedidos Completados
                  </h3>
                  <HiOutlineShoppingCart size={32} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold">
                  {estadisticasDelDia.pedidosCompletados}
                </p>
              </div>

              <div className="texto_letrasA to-purple-600 rounded-lg shadow-md p-6 text-black">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">
                    Ticket Promedio
                  </h3>
                  <HiOutlineChartBar size={32} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold">
                  {formatearMoneda(
                    estadisticasDelDia.pedidosCompletados > 0
                      ? estadisticasDelDia.gananciaTotal /
                          estadisticasDelDia.pedidosCompletados
                      : 0
                  )}
                </p>
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Ventas por Método de Pago
              </h2>
              {estadisticasDelDia.porMetodoPago.length > 0 ? (
                <div className="space-y-3">
                  {estadisticasDelDia.porMetodoPago.map((metodo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {metodo.metodo}
                        </p>
                        <p className="text-sm text-gray-600">
                          {metodo.cantidad} pedidos
                        </p>
                      </div>
                      <p className="text-xl font-bold text-cyan-600">
                        {formatearMoneda(metodo.total)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay datos de métodos de pago
                </p>
              )}
            </div>

            {/* Tipo de entrega */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Tipo de Entrega</h2>
              {estadisticasDelDia.porTipoEntrega.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {estadisticasDelDia.porTipoEntrega.map((tipo, index) => (
                    <div
                      key={index}
                      className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-600"
                    >
                      <p className="text-gray-600 text-sm mb-1">
                        {tipo.tipo.replace("_", " ")}
                      </p>
                      <p className="text-3xl font-bold text-cyan-600">
                        {tipo.cantidad}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay datos de tipo de entrega
                </p>
              )}
            </div>
          </div>
        )}

        {/* Vista: Productos Más Vendidos */}
        {vistaActual === "productos" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
              Top 10 Productos Más Vendidos
            </h2>
            {productosMasVendidos.length > 0 ? (
              <div className="space-y-3">
                {productosMasVendidos.map((producto, index) => (
                  <div
                    key={producto.productoId}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-600 text-white rounded-full font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Precio: {formatearMoneda(producto.precio)} | Vendidos:{" "}
                        {producto.cantidadVendida} unidades
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Ventas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatearMoneda(producto.totalVentas)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HiOutlineShoppingCart
                  className="mx-auto text-gray-400 mb-4"
                  size={64}
                />
                <p className="text-gray-500 text-lg">
                  No hay productos vendidos aún
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vista: Generador de Reportes */}
        {vistaActual === "reporte" && (
          <div className="space-y-6">
            {/* Selector de fechas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Generar Reporte</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={generarReporte}
                    disabled={loading}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg font-bold hover:bg-cyan-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <HiOutlineDocumentReport size={20} />
                    {loading ? "Generando..." : "Generar Reporte"}
                  </button>
                </div>
              </div>
            </div>

            {/* Reporte generado */}
            {reporte && (
              <div className="space-y-6">
                {/* Resumen */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Resumen del Periodo</h2>
                    <div className="text-sm text-gray-600">
                      {formatearFecha(reporte.periodo.inicio)} -{" "}
                      {formatearFecha(reporte.periodo.fin)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-600">
                      <p className="text-sm text-gray-600 mb-1">
                        Total Pedidos
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {reporte.resumen.totalPedidos}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-600">
                      <p className="text-sm text-gray-600 mb-1">
                        Ventas Totales
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatearMoneda(reporte.resumen.ventasTotales)}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-600">
                      <p className="text-sm text-gray-600 mb-1">
                        Ticket Promedio
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {formatearMoneda(reporte.resumen.ticketPromedio)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos más vendidos del periodo */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Productos Más Vendidos (Periodo)
                  </h2>
                  <div className="space-y-2">
                    {reporte.productosMasVendidos.slice(0, 5).map((prod, i) => (
                      <div
                        key={prod.productoId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-cyan-600">
                            #{i + 1}
                          </span>
                          <div>
                            <p className="font-semibold">{prod.nombre}</p>
                            <p className="text-sm text-gray-600">
                              {prod.cantidadVendida} unidades
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-green-600">
                          {formatearMoneda(prod.totalVentas)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métodos de pago */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Métodos de Pago</h2>
                  <div className="space-y-2">
                    {reporte.metodoPago.map((metodo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{metodo.metodo}</p>
                          <p className="text-sm text-gray-600">
                            {metodo.cantidad} pedidos
                          </p>
                        </div>
                        <p className="font-bold text-cyan-600">
                          {formatearMoneda(metodo.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ventas por día */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Ventas por Día</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {reporte.ventasPorDia.map((venta, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">
                            {formatearFecha(venta.fecha)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {venta.cantidadPedidos} pedidos
                          </p>
                        </div>
                        <p className="font-bold text-cyan-600">
                          {formatearMoneda(venta.totalVentas)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
