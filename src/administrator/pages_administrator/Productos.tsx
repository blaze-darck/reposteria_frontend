import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiChevronDown,
  HiChevronUp,
  HiOutlinePhotograph,
  HiX,
} from "react-icons/hi";

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

// Configuración de la API
const API_URL = "http://localhost:3000";

// Servicio API
const api = {
  // Productos
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  },

  async createProducto(data: any): Promise<Producto> {
    console.log("🔗 POST", `${API_URL}/productos`, data);
    const response = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al crear producto (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  async updateProducto(id: number, data: any): Promise<Producto> {
    console.log("🔗 PATCH", `${API_URL}/productos/${id}`, data);
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al actualizar producto (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  async deleteProducto(id: number): Promise<void> {
    console.log("🔗 DELETE", `${API_URL}/productos/${id}`);
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    console.log("📥 Respuesta DELETE:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al eliminar:", errorText);
      throw new Error(`Error al eliminar producto (${response.status})`);
    }
  },

  async toggleEstado(id: number, activo: boolean): Promise<Producto> {
    console.log("🔗 PATCH", `${API_URL}/productos/${id}/estado`, { activo });
    const response = await fetch(`${API_URL}/productos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo }),
    });

    const responseData = await response.json();
    console.log("📥 Respuesta toggle estado:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Error al cambiar estado (${response.status}): ${JSON.stringify(
          responseData
        )}`
      );
    }
    return responseData;
  },

  // Categorías
  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error("Error al cargar categorías");
    return response.json();
  },

  // Subcategorías
  async getSubcategorias(): Promise<Subcategoria[]> {
    const response = await fetch(`${API_URL}/subcategorias`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de subcategorías:", response.status, errorText);
      throw new Error(`Error al cargar subcategorías (${response.status})`);
    }
    return response.json();
  },
};

export const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    disponibilidad: "",
    imagen: "",
    subcategoria: "",
  });

  const [imagenPreview, setImagenPreview] = useState<string>("");

  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 5;

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log("🔍 Intentando conectar a:", API_URL);

      const productosData = await api.getProductos();
      const categoriasData = await api.getCategorias();

      console.log("Productos cargados:", productosData);
      console.log("Categorías cargadas:", categoriasData);

      let subcategoriasData: Subcategoria[] = [];
      try {
        subcategoriasData = await api.getSubcategorias();
        console.log("Subcategorías cargadas:", subcategoriasData);
      } catch (subError) {
        console.warn(
          "⚠️ No se pudieron cargar subcategorías del endpoint, extrayendo de productos..."
        );
        const subcatsMap = new Map<number, Subcategoria>();
        productosData.forEach((p) => {
          if (p.subcategoria && p.subcategoria.id) {
            subcatsMap.set(p.subcategoria.id, p.subcategoria);
          }
        });
        subcategoriasData = Array.from(subcatsMap.values());
        console.log(
          "✅ Subcategorías extraídas de productos:",
          subcategoriasData
        );
      }

      setProductos(
        productosData.map((p) => ({
          ...p,
          precio: Number(p.precio),
          disponibilidad: Number(p.disponibilidad || 0),
        }))
      );
      setCategorias(categoriasData.filter((c) => c.activo));
      setSubcategorias(subcategoriasData.filter((s) => s.activo));
    } catch (error: any) {
      console.error("Error detallado:", error);
      console.error("URL intentada:", API_URL);

      let mensaje = "Error al cargar los datos. ";

      if (error.message.includes("Failed to fetch")) {
        mensaje += `\n\nNo se puede conectar a ${API_URL}\n\n`;
        mensaje += "Posibles causas:\n";
        mensaje += "1. El backend no está corriendo\n";
        mensaje += "2. La URL es incorrecta\n";
        mensaje += "3. CORS no está habilitado en el backend";
      } else if (error.message.includes("404")) {
        mensaje += `\n\n❌ Endpoint no encontrado (404)\n\n`;
        mensaje +=
          "Verifica que las rutas /productos, /categorias y /subcategorias existan";
      } else {
        mensaje += error.message;
      }

      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id: number, nuevoEstado: boolean) => {
    try {
      await api.toggleEstado(id, nuevoEstado);
      await cargarDatos();
      alert(
        `Producto ${nuevoEstado ? "activado" : "desactivado"} correctamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del producto");
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      disponibilidad: "",
      imagen: "",
      subcategoria: "",
    });
    setImagenPreview("");
    setShowModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      disponibilidad: (producto.disponibilidad || 0).toString(),
      imagen: producto.imagen || "",
      subcategoria: producto.subcategoria.id.toString(),
    });
    setImagenPreview(producto.imagen || "");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar este producto?")) return;

    try {
      await api.deleteProducto(id);
      await cargarDatos();
      alert("Producto desactivado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el producto");
    }
  };

  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (
      !form.nombre ||
      !form.precio ||
      !form.disponibilidad ||
      !form.subcategoria
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("precio", form.precio);
    formData.append("disponibilidad", form.disponibilidad);
    formData.append("subcategoria", form.subcategoria);

    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }

    try {
      const url = editingId
        ? `${API_URL}/productos/${editingId}`
        : `${API_URL}/productos/upload`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();
      console.log("Servidor responde:", data);

      if (!response.ok) throw new Error("Error en el servidor");

      alert(editingId ? "Producto actualizado" : "Producto creado");

      await cargarDatos();
      setShowModal(false);
      setImagenFile(null);
      setImagenPreview("");
    } catch (err) {
      console.error(err);
      alert("Error al guardar el producto");
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "" ||
      producto.subcategoria?.categoria?.id === parseInt(categoryFilter);
    const matchEstado =
      estadoFilter === ""
        ? true
        : estadoFilter === "activo"
        ? producto.activo
        : !producto.activo;
    return matchSearch && matchCategory && matchEstado;
  });

  // Paginación
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productosActuales = productosFiltrados.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleEstadoChange = (value: string) => {
    setEstadoFilter(value);
    setCurrentPage(1);
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <span className="bg_fondo text-transparent bg-clip-text">
            Gestión de Productos
          </span>
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg_fondo text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <HiOutlinePlus size={20} />
          Agregar Producto
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl transition-all font-semibold shadow-md hover:shadow-lg border-2 border-slate-200"
        >
          {showFilters ? (
            <>
              <HiChevronUp size={20} />
              Ocultar Filtros
            </>
          ) : (
            <>
              <HiChevronDown size={20} />
              Mostrar Filtros
            </>
          )}
        </button>
      </div>

      {/* Filtros colapsables */}
      {showFilters && (
        <div className="mb-6 bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 border-2 border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscador */}
            <div className="relative group">
              <HiOutlineSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-pink-400 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="🔍 Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white hover:border-pink-300 transition-all group-hover:shadow-md"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="relative group">
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium
                 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 
                 bg-white hover:border-pink-300 transition-all cursor-pointer appearance-none pr-10 group-hover:shadow-md"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-pink-400 transition-colors"
                size={20}
              />
            </div>

            {/* Filtro por estado */}
            <div className="relative group">
              <select
                value={estadoFilter}
                onChange={(e) => handleEstadoChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                 bg-white hover:border-cyan-300 transition-all cursor-pointer appearance-none pr-10 group-hover:shadow-md"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
              <HiChevronDown
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-cyan-400 transition-colors"
                size={20}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto shadow-xl rounded-2xl bg-white mb-4 border-2 border-slate-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-pink-100 to-cyan-100 font-semibold text-slate-800">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Subcategoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosActuales.length > 0 ? (
              productosActuales.map((producto, index) => (
                <tr
                  key={producto.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-pink-50 transition-colors`}
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1.5 rounded-lg font-semibold">
                      {producto.subcategoria?.categoria?.nombre ||
                        "Sin categoría"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-lg font-semibold">
                      {producto.subcategoria?.nombre || "Sin subcategoría"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    Bs. {Number(producto.precio).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {producto.disponibilidad || 0} unidades
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleEstado(producto.id, !producto.activo)
                      }
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                        producto.activo
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {producto.activo ? "✓ Activo" : "✗ Inactivo"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="text-pink-500 hover:text-pink-700 hover:bg-pink-50 p-2 rounded-lg transition-all mr-2"
                      title="Editar"
                    >
                      <HiOutlinePencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <HiOutlineSearch size={48} className="text-slate-300" />
                    <p className="text-lg font-semibold">
                      No se encontraron productos
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contador de resultados */}
      <div className="text-center text-sm text-slate-600 mb-4 font-medium">
        Mostrando{" "}
        <span className="font-bold text-pink-600">
          {productosActuales.length}
        </span>{" "}
        de{" "}
        <span className="font-bold text-cyan-600">
          {productosFiltrados.length}
        </span>{" "}
        productos
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md"
          >
            ← Anterior
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${
                  currentPage === page
                    ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg scale-110"
                    : "border-2 border-slate-200 hover:bg-slate-50 bg-white shadow-md hover:shadow-lg"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal con diseño mejorado */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-2xl border-2 border-pink-200 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                {editingId ? (
                  <>
                    <HiOutlinePencil className="text-pink-500" size={28} />
                    Editar Producto
                  </>
                ) : (
                  <>
                    <HiOutlinePlus className="text-cyan-500" size={28} />
                    Nuevo Producto
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-all"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="space-y-5 mb-8">
              {/* Nombre */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  Nombre del producto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hamburguesa Clásica"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white transition-all hover:border-pink-300 group-hover:shadow-md"
                />
              </div>

              {/* Descripción */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción detallada del producto..."
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white transition-all hover:border-purple-300 group-hover:shadow-md resize-none"
                />
              </div>

              {/* Subcategoría */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Subcategoría
                </label>
                <div className="relative">
                  <select
                    value={form.subcategoria}
                    onChange={(e) =>
                      setForm({ ...form, subcategoria: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white transition-all hover:border-cyan-300 group-hover:shadow-md cursor-pointer appearance-none pr-10"
                  >
                    <option value="">📂 Seleccionar subcategoría</option>
                    {categorias.map((cat) => (
                      <optgroup key={cat.id} label={`📋 ${cat.nombre}`}>
                        {subcategorias
                          .filter((sub) => sub.categoria.id === cat.id)
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              └─ {sub.nombre}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                  <HiChevronDown
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Precio y Stock en grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Precio (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.precio}
                    onChange={(e) =>
                      setForm({ ...form, precio: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white transition-all hover:border-green-300 group-hover:shadow-md"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.disponibilidad}
                    onChange={(e) =>
                      setForm({ ...form, disponibilidad: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all hover:border-blue-300 group-hover:shadow-md"
                  />
                </div>
              </div>

              {/* Imagen del producto */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <HiOutlinePhotograph className="text-pink-500" size={18} />
                  Imagen del producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 file:cursor-pointer"
                />
                {imagenPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                      Vista previa
                    </p>
                    <div className="relative group/image">
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="w-full h-56 object-cover rounded-xl border-2 border-slate-200 shadow-lg group-hover/image:shadow-xl transition-all"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-10 rounded-xl transition-all"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreview("");
                          setImagenFile(null);
                          setForm({ ...form, imagen: "" });
                        }}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="Eliminar imagen"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4 border-t-2 border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold bg-white shadow-sm hover:shadow"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg_fondo text-white rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {editingId ? " Actualizar" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
