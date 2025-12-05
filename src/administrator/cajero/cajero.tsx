import { useState, useEffect } from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlineQrcode,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Subcategoria {
  id: number;
  nombre: string;
  categoria: Categoria;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string | null;
  disponibilidad: number; // ✅ Stock disponible
  subcategoria: Subcategoria;
  activo: boolean;
}

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stockDisponible: number; // ✅ Guardamos el stock para validar
}

// Configuración de la API
const API_URL = "http://localhost:3000";

// Servicio API
const api = {
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al cargar productos");
    const data = await response.json();
    return data.datos || data;
  },

  async getUsuarios(): Promise<Usuario[]> {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error("Error al cargar usuarios");
    const data = await response.json();
    return data.datos || data;
  },

  async crearPedido(pedidoData: any) {
    console.log("🔗 POST", `${API_URL}/pedidos`, pedidoData);
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoData),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        responseData.message || `Error al crear pedido (${response.status})`
      );
    }
    return responseData;
  },
};

export function CajeroPedidos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [metodoPago, setMetodoPago] = useState<"EFECTIVO" | "QR">("EFECTIVO");
  const [tipoEntrega, setTipoEntrega] = useState<"PARA_AQUI" | "LLEVAR">(
    "PARA_AQUI"
  );
  const [notas, setNotas] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error" | "warning";
  } | null>(null);
  const [mostrarSelectorUsuario, setMostrarSelectorUsuario] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log("🔍 Cargando datos de:", API_URL);

      const [productosData, usuariosData] = await Promise.all([
        api.getProductos(),
        api.getUsuarios(),
      ]);

      console.log("✅ Productos cargados:", productosData.length);
      console.log("✅ Usuarios cargados:", usuariosData.length);

      // Filtrar solo productos activos
      setProductos(
        productosData
          .filter((p) => p.activo)
          .map((p) => ({
            ...p,
            precio: Number(p.precio),
            disponibilidad: Number(p.disponibilidad || 0),
          }))
      );
      setUsuarios(usuariosData);
    } catch (error: any) {
      console.error("❌ Error al cargar datos:", error);
      mostrarMensaje(
        "Error al cargar datos. Verifica que el servidor esté corriendo.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDACIÓN DE STOCK al agregar al carrito
  const agregarAlCarrito = (producto: Producto) => {
    // Validar que el producto tenga stock
    if (producto.disponibilidad <= 0) {
      mostrarMensaje(`❌ ${producto.nombre} está agotado (sin stock)`, "error");
      return;
    }

    const itemExistente = carrito.find(
      (item) => item.productoId === producto.id
    );

    if (itemExistente) {
      // Validar que no exceda el stock disponible
      if (itemExistente.cantidad >= producto.disponibilidad) {
        mostrarMensaje(
          `⚠️ Stock insuficiente para ${producto.nombre}. Solo quedan ${producto.disponibilidad} unidades`,
          "warning"
        );
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stockDisponible: producto.disponibilidad,
        },
      ]);
    }
  };

  // ✅ VALIDACIÓN al actualizar cantidad
  const actualizarCantidad = (productoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const item = carrito.find((i) => i.productoId === productoId);
    if (!item) return;

    // Validar que no exceda el stock
    if (nuevaCantidad > item.stockDisponible) {
      mostrarMensaje(
        `⚠️ Stock insuficiente. Solo quedan ${item.stockDisponible} unidades de ${item.nombre}`,
        "warning"
      );
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.productoId === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter((item) => item.productoId !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  const crearPedido = async () => {
    if (!usuarioSeleccionado) {
      mostrarMensaje("Debes seleccionar un cliente", "error");
      return;
    }

    if (carrito.length === 0) {
      mostrarMensaje("Agrega productos al carrito", "error");
      return;
    }

    // Si el método de pago es QR, mostrar el modal primero
    if (metodoPago === "QR") {
      setShowQR(true);
      return;
    }

    // Si es efectivo, crear pedido directamente
    await procesarPedido();
  };

  const procesarPedido = async () => {
    setProcesando(true);

    const pedidoData = {
      usuarioId: usuarioSeleccionado!.id,
      metodoPago,
      tipoEntrega,
      notas: notas.trim() || undefined,
      detalles: carrito.map((item) => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
      })),
    };

    try {
      const response = await api.crearPedido(pedidoData);
      mostrarMensaje(
        `✅ Pedido ${response.datos?.numeroPedido || ""} creado exitosamente`,
        "success"
      );
      setShowQR(false);
      limpiarFormulario();
      // ✅ Recargar productos para actualizar stock
      cargarDatos();
    } catch (error: any) {
      console.error("Error al crear pedido:", error);
      mostrarMensaje(error.message || "Error al crear el pedido", "error");
    } finally {
      setProcesando(false);
    }
  };

  const limpiarFormulario = () => {
    setCarrito([]);
    setUsuarioSeleccionado(null);
    setNotas("");
    setBusqueda("");
    setBusquedaUsuario("");
    setMostrarSelectorUsuario(false);
  };

  const mostrarMensaje = (
    texto: string,
    tipo: "success" | "error" | "warning"
  ) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      u.apellidoPaterno.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      u.correo.toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  const getImageUrl = (imagen: string | null): string => {
    if (!imagen) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";
    }
    if (imagen.startsWith("http")) {
      return imagen;
    }
    const filename = imagen.replace(/^\/uploads\/productos\//, "");
    return `${API_URL}/uploads/productos/${filename}`;
  };

  // ✅ Función para obtener el color del badge de stock
  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return "bg-red-600 text-white";
    if (stock <= 5) return "bg-yellow-500 text-white";
    if (stock <= 10) return "bg-orange-500 text-white";
    return "bg-green-600 text-white";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando sistema de caja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-pink-500">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <HiOutlineShoppingCart className="text-pink-500" size={36} />
            Sistema de Caja
          </h1>
        </div>

        {/* Mensaje de notificación */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 font-semibold ${
              mensaje.tipo === "success"
                ? "bg-green-100 text-green-800 border-green-600"
                : mensaje.tipo === "warning"
                ? "bg-yellow-100 text-yellow-800 border-yellow-600"
                : "bg-red-100 text-red-800 border-red-600"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Cliente y Productos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selección de cliente */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-pink-500">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <HiOutlineUser size={24} className="text-pink-500" />
                Cliente
              </h2>

              {!usuarioSeleccionado ? (
                <>
                  <div className="relative mb-4">
                    <HiOutlineSearch
                      className="absolute left-3 top-3 text-black-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Buscar cliente por nombre o correo..."
                      value={busquedaUsuario}
                      onChange={(e) => setBusquedaUsuario(e.target.value)}
                      className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:border-pink-600 outline-none"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {usuariosFiltrados.map((usuario) => (
                      <div
                        key={usuario.id}
                        onClick={() => setUsuarioSeleccionado(usuario)}
                        className="p-3 border-2 border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-600 cursor-pointer transition"
                      >
                        <p className="font-semibold">
                          {usuario.nombre} {usuario.apellidoPaterno}{" "}
                          {usuario.apellidoMaterno}
                        </p>
                        <p className="text-sm text-gray-600">
                          {usuario.correo}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 bg_fondo rounded-lg border-2 border-pink-600">
                  <div>
                    <p className="font-bold text-lg">
                      {usuarioSeleccionado.nombre}{" "}
                      {usuarioSeleccionado.apellidoPaterno}{" "}
                      {usuarioSeleccionado.apellidoMaterno}
                    </p>
                    <p className="text-gray-600">
                      {usuarioSeleccionado.correo}
                    </p>
                  </div>
                  <button
                    onClick={() => setUsuarioSeleccionado(null)}
                    className="text-red-600 hover:text-red-800 font-semibold hover:underline"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>

            {/* Búsqueda y catálogo de productos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Productos</h2>
              <div className="relative mb-4">
                <HiOutlineSearch
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 p-3 border-2 border-pink-300 rounded-lg focus:border-pink-600 outline-none"
                />
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {productosFiltrados.map((producto) => {
                  const cantidadEnCarrito =
                    carrito.find((item) => item.productoId === producto.id)
                      ?.cantidad || 0;
                  const stockRestante =
                    producto.disponibilidad - cantidadEnCarrito;

                  return (
                    <div
                      key={producto.id}
                      onClick={() => agregarAlCarrito(producto)}
                      className={`border-2 rounded-lg p-3 transition relative ${
                        producto.disponibilidad === 0
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                          : "border-gray-200 hover:shadow-lg cursor-pointer hover:border-pink-800 bg-white"
                      }`}
                    >
                      {/* ✅ Badge de stock */}
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getStockBadgeColor(
                          producto.disponibilidad
                        )}`}
                      >
                        {producto.disponibilidad === 0
                          ? "AGOTADO"
                          : `Stock: ${producto.disponibilidad}`}
                      </div>

                      <img
                        src={getImageUrl(producto.imagen)}
                        alt={producto.nombre}
                        className="w-full h-32 object-cover rounded mb-2"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";
                        }}
                      />
                      <h3 className="font-semibold text-black-800 mb-1 text-sm">
                        {producto.nombre}
                      </h3>
                      <p className="text-xl font-bold text-pink-600">
                        Bs. {producto.precio.toFixed(2)}
                      </p>

                      {/* ✅ Mostrar cantidad en carrito si existe */}
                      {cantidadEnCarrito > 0 && (
                        <div className="mt-2 bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded">
                          En carrito: {cantidadEnCarrito} | Quedan:{" "}
                          {stockRestante}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel derecho: Carrito y opciones */}
          <div className="space-y-6">
            {/* Carrito */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Carrito de Compra</h2>

              {carrito.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiOutlineShoppingCart
                    size={48}
                    className="mx-auto mb-2 opacity-30"
                  />
                  <p>Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {carrito.map((item) => (
                    <div
                      key={item.productoId}
                      className="flex items-center justify-between border-b-2 border-pink-200 pb-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.nombre}</p>
                        <p className="text-pink-900 text-sm">
                          Bs. {item.precio.toFixed(2)}
                        </p>
                        {/* ✅ Alerta de stock bajo */}
                        {item.stockDisponible - item.cantidad <= 3 && (
                          <div className="flex items-center gap-1 text-pink-600 text-xs mt-1">
                            <HiOutlineExclamationCircle size={14} />
                            <span>
                              Quedan {item.stockDisponible - item.cantidad}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            actualizarCantidad(
                              item.productoId,
                              item.cantidad - 1
                            )
                          }
                          className="p-1 bg-gray-200 rounded hover:bg-pink-300"
                        >
                          <HiOutlineMinus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            actualizarCantidad(
                              item.productoId,
                              item.cantidad + 1
                            )
                          }
                          disabled={item.cantidad >= item.stockDisponible}
                          className="p-1 bg-gray-200 rounded hover:bg-pink-300 disabled:bg-pink-100 disabled:cursor-not-allowed"
                        >
                          <HiOutlinePlus size={16} />
                        </button>
                        <button
                          onClick={() => eliminarDelCarrito(item.productoId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-pink-900">
                    Bs. {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Opciones de pedido */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>

              {/* Método de pago */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMetodoPago("EFECTIVO")}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold ${
                      metodoPago === "EFECTIVO"
                        ? "border-pink-600 bg-pink-50 text-black-700"
                        : "border-pink-300 text-black-700"
                    }`}
                  >
                    <HiOutlineCash size={20} />
                    Efectivo
                  </button>
                  <button
                    onClick={() => setMetodoPago("QR")}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold ${
                      metodoPago === "QR"
                        ? "border-pink-600 bg-pink-50 text-black-700"
                        : "border-pink-300 text-black-700"
                    }`}
                  >
                    <HiOutlineQrcode size={20} />
                    QR
                  </button>
                </div>
              </div>

              {/* Tipo de entrega */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Tipo de Entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTipoEntrega("PARA_AQUI")}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold ${
                      tipoEntrega === "PARA_AQUI"
                        ? "border-pink-600 bg-pink-50 text-black-700"
                        : "border-pink-300 text-black-700"
                    }`}
                  >
                    <HiOutlineHome size={20} />
                    Para Aquí
                  </button>
                  <button
                    onClick={() => setTipoEntrega("LLEVAR")}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold ${
                      tipoEntrega === "LLEVAR"
                        ? "border-pink-600 bg-pink-50 text-black-700"
                        : "border-pink-300 text-black-700"
                    }`}
                  >
                    <HiOutlineShoppingBag size={20} />
                    Para Llevar
                  </button>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Sin cebolla, extra queso..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:border-cyan-600 outline-none"
                  rows={3}
                />
              </div>

              {/* Botones de acción */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={crearPedido}
                  disabled={
                    procesando || carrito.length === 0 || !usuarioSeleccionado
                  }
                  className="w-full bg_fondo text-black py-4 rounded-lg font-bold hover:bg-pink-500 disabled:bg-pink-300 disabled:cursor-not-allowed transition text-lg border-2 border-pink-500"
                >
                  {procesando ? "Procesando..." : "Crear Pedido"}
                </button>
                <button
                  onClick={limpiarFormulario}
                  className="w-full bg-pink-200 text-black-800 py-3 rounded-lg font-bold hover:bg-pink-300 transition border-2 border-pink-300"
                >
                  Limpiar Todo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal del código QR */}
        {showQR && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 border-b border-gray-200 flex justify-between items-center"
                style={{ background: "#be95c4" }}
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  Escanea para Pagar
                </h2>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl text-gray-600">×</span>
                </button>
              </div>

              <div className="p-8 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 inline-block">
                  <img
                    src="/qr.jpeg"
                    alt="Código QR de pago"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <p className="text-gray-600 mb-2">Total a pagar:</p>
                <p className="text-4xl font-bold mb-6 text-cyan-600">
                  Bs. {calcularTotal().toFixed(2)}
                </p>

                <p className="text-sm text-gray-500 mb-6">
                  Escanea este código con tu aplicación de pago
                </p>

                <button
                  onClick={procesarPedido}
                  disabled={procesando}
                  className="w-full bg_fondo text-white py-3 rounded-lg font-bold hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {procesando ? "Procesando..." : "Confirmar Pago"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
