import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import ModalProducto from "../productos/modalProductos";

export default function TablaProductos() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  useEffect(() => {
    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(productosGuardados);
  }, []);

  const eliminarProducto = (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este producto?")) {
      const productosActualizados = productos.filter((prod) => prod.id !== id);
      localStorage.setItem("productos", JSON.stringify(productosActualizados));
      setProductos(productosActualizados);
    }
  };

  const abrirModal = () => {
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setProductoAEditar(null);
  };

  const editarProducto = (producto) => {
    setProductoAEditar(producto);
    abrirModal();
  };

  const actualizarProductos = () => {
    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(productosGuardados);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-center">
          Productos Registrados
        </h2>
        <button
          onClick={abrirModal}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          title="Adicionar producto"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos registrados.
        </p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Categoría</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} className="text-center hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {prod.nombre}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {prod.categoria}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${prod.precio}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {prod.stock}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => editarProducto(prod)}
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                    title="Editar producto"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => eliminarProducto(prod.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar producto"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ModalProducto
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onRegister={actualizarProductos}
        producto={productoAEditar}
      />
    </div>
  );
}
