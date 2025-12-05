import { useState, useEffect } from "react";

// Interfaces basadas en tu backend
interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface Subcategoria {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: Categoria;
  activo: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponibilidad?: number;
  imagen: string | null;
  subcategoria: Subcategoria;
  activo: boolean;
}

interface CartItem extends Producto {
  quantity: number;
}

type Quantities = Record<number, number>;

const API_URL = "http://localhost:3000";

const api = {
  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error("Error al cargar categorías");
    return response.json();
  },

  async getProductosActivos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos/activos`);
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  },

  async getSubcategorias(): Promise<Subcategoria[]> {
    const response = await fetch(`${API_URL}/subcategorias`);
    if (!response.ok) throw new Error("Error al cargar subcategorías");
    return response.json();
  },
};

const MenuCompleto = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [animatingItems, setAnimatingItems] = useState<number[]>([]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        console.log("Intentando conectar a:", API_URL);

        const [categoriasData, productosData] = await Promise.all([
          api.getCategorias(),
          api.getProductosActivos(),
        ]);

        console.log("Categorías cargadas:", categoriasData);
        console.log("Productos activos cargados:", productosData);

        const categoriasActivas = categoriasData.filter((c) => c.activo);
        setCategorias(categoriasActivas);

        setProductos(productosData);

        if (categoriasActivas.length > 0) {
          setCategoriaActiva(categoriasActivas[0].id);
        }

        setError("");
      } catch (err: any) {
        console.error("Error detallado:", err);
        let mensajeError = "Error al cargar los datos. ";

        if (err.message.includes("Failed to fetch")) {
          mensajeError += `No se puede conectar al servidor en ${API_URL}. Verifica que el backend esté corriendo.`;
        } else {
          mensajeError += err.message;
        }

        setError(mensajeError);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter(
    (p) =>
      p.subcategoria?.categoria?.id === categoriaActiva &&
      p.disponibilidad !== 0
  );

  const getQuantity = (productId: number): number => {
    return quantities[productId] || 1;
  };

  const updateQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity >= 1) {
      setQuantities({ ...quantities, [productId]: newQuantity });
    }
  };

  const addToCart = (product: Producto): void => {
    const quantity = getQuantity(product.id);
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity,
      };
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setQuantities({ ...quantities, [product.id]: 1 });

    setAnimatingItems([...animatingItems, product.id]);
    setTimeout(() => {
      setAnimatingItems((prev) => prev.filter((id) => id !== product.id));
    }, 600);
  };

  const removeFromCart = (productId: number): void => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): string => {
    return cart
      .reduce((total, item) => total + Number(item.precio) * item.quantity, 0)
      .toFixed(2);
  };

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

  const categoriaSeleccionada = categorias.find(
    (c) => c.id === categoriaActiva
  );
  const accentColor = "#fb6f92";
  const bgGradient = "#f1c0e8";

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: bgGradient }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">
            Cargando menú...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: bgGradient }}
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error al cargar
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: accentColor }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5" style={{ background: bgGradient }}>
      <div className="max-w-7xl mx-auto pb-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {categoriaSeleccionada?.nombre || "Menú"}
            </h1>
            <p className="text-gray-600">
              {categoriaSeleccionada?.descripcion || ""}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaActiva(categoria.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  categoriaActiva === categoria.id
                    ? "text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={
                  categoriaActiva === categoria.id
                    ? { background: accentColor }
                    : {}
                }
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 stroke-gray-300 fill-none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
              <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
            </svg>
            <p className="text-gray-500 text-lg">
              No hay productos disponibles en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={getImageUrl(producto.imagen)}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {producto.subcategoria && (
                    <span
                      className="absolute top-4 right-4 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg"
                      style={{ background: accentColor }}
                    >
                      {producto.subcategoria.nombre}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {producto.descripcion || "Delicioso producto"}
                  </p>

                  <div className="flex justify-between items-center mb-5">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: accentColor }}
                    >
                      Bs. {Number(producto.precio).toFixed(2)}
                    </span>
                    <div
                      className="flex items-center gap-3 rounded-full p-1"
                      style={{ background: "#dbbdb1" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            producto.id,
                            getQuantity(producto.id) - 1
                          )
                        }
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105"
                        style={{ color: accentColor }}
                      >
                        −
                      </button>
                      <span className="font-semibold text-gray-800 w-8 text-center">
                        {getQuantity(producto.id)}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            producto.id,
                            getQuantity(producto.id) + 1
                          )
                        }
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105"
                        style={{ color: accentColor }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(producto)}
                    className="w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                    style={{ background: accentColor }}
                  >
                    <svg
                      className="w-5 h-5 stroke-white fill-none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
                      <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
                    </svg>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carrito flotante */}
        <div
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-2xl z-40"
          style={{
            background: "#0f6c73",
          }}
        >
          <svg
            className="w-9 h-9 stroke-white fill-none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
            <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
          </svg>
          {getTotalItems() > 0 && (
            <span
              className={`absolute -top-2 -right-2 bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shadow-lg ${
                animatingItems.length > 0 ? "animate-bounce" : ""
              }`}
            >
              {getTotalItems()}
            </span>
          )}
          {animatingItems.length > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-75"></div>
          )}
        </div>

        {/* Modal del carrito */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 border-b border-gray-200 flex justify-between items-center"
                style={{ background: "#dbbdb1" }}
              >
                <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl text-gray-600">×</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 stroke-gray-300 fill-none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
                      <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      Tu carrito está vacío
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={getImageUrl(item.imagen)}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800">
                              {item.nombre}
                            </h3>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {item.subcategoria?.nombre || ""}
                            </span>
                          </div>
                          <p
                            className="text-sm font-bold mb-2"
                            style={{ color: accentColor }}
                          >
                            {Number(item.precio).toFixed(2)} Bs
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-200"
                              style={{ color: accentColor }}
                            >
                              −
                            </button>
                            <span className="font-semibold text-gray-800 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-200"
                              style={{ color: accentColor }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            Eliminar
                          </button>
                          <p
                            className="font-bold text-lg"
                            style={{ color: accentColor }}
                          >
                            Bs{" "}
                            {(Number(item.precio) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div
                  className="p-6 border-t border-gray-200"
                  style={{ background: "#f9f9f9" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">
                      Total:
                    </span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: accentColor }}
                    >
                      Bs {getTotalPrice()}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowQR(true)}
                    className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg"
                    style={{ background: accentColor }}
                  >
                    Proceder al Pago
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal del código QR */}
        {showQR && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 border-b border-gray-200 flex justify-between items-center"
                style={{ background: "#dbbdb1" }}
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
                    className="w-64 h-64"
                  />
                </div>

                <p className="text-gray-600 mb-2">Total a pagar:</p>
                <p
                  className="text-4xl font-bold mb-4"
                  style={{ color: accentColor }}
                >
                  Bs {getTotalPrice()}
                </p>

                <p className="text-sm text-gray-500">
                  Escanea este código con tu aplicación de pago
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCompleto;
