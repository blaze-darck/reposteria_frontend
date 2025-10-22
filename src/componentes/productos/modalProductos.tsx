import React, { useState, useEffect } from "react";

export default function ModalProducto({
  isOpen,
  onClose,
  onRegister,
  producto = null,
}) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecio(producto.precio);
      setStock(producto.stock);
      setIsEditing(true);
    } else {
      setNombre("");
      setCategoria("");
      setPrecio("");
      setStock("");
      setIsEditing(false);
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !categoria || !precio || !stock) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevoProducto = {
      id: isEditing ? producto.id : Date.now(),
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock),
    };

    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];

    if (isEditing) {
      const productosActualizados = productosGuardados.map((prod) =>
        prod.id === producto.id ? nuevoProducto : prod
      );
      localStorage.setItem("productos", JSON.stringify(productosActualizados));
    } else {
      productosGuardados.push(nuevoProducto);
      localStorage.setItem("productos", JSON.stringify(productosGuardados));
    }

    onRegister();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-gray-900 bg-opacity-50 w-full max-w-sm p-8 rounded-lg shadow-lg relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {isEditing ? "Editar Producto" : "Agregar Producto"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Nombre del producto"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Categoría</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Categoría"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Precio"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Stock"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {isEditing ? "Actualizar Producto" : "Agregar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
