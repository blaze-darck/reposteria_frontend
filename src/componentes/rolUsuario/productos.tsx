export default function AllProducts() {
  const categorias = [
    {
      nombre: "Pasteles",
      img: "https://images.unsplash.com/photo-1603025014357-4d5a3a2c4a3d?auto=format&fit=crop&w=600&q=80",
      descripcion: "Deliciosos pasteles personalizados para cada ocasión.",
    },
    {
      nombre: "Cupcakes",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
      descripcion: "Pequeños bocados llenos de sabor y color.",
    },
    {
      nombre: "Postres Individuales",
      img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
      descripcion: "Mini delicias para endulzar tus momentos.",
    },
    {
      nombre: "Galletas",
      img: "https://images.unsplash.com/photo-1606312619070-43e40ff2c8a3?auto=format&fit=crop&w=600&q=80",
      descripcion: "Crujientes y suaves, hechas con amor y mantequilla real.",
    },
    {
      nombre: "Tartas y Pays",
      img: "https://images.unsplash.com/photo-1617196034890-cb4b05b6bfc3?auto=format&fit=crop&w=600&q=80",
      descripcion:
        "Tartas frescas con frutas naturales y rellenos irresistibles.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-rose-100 to-yellow-100 text-texto font-sans">
      {/* Encabezado */}
      <header className="text-center py-16 px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold text-texto mb-4 drop-shadow-sm">
          Todos nuestros <span className="text-texto">Productos</span>
        </h2>
        <p className="text-lg md:text-xl text-texto max-w-2xl mx-auto">
          Explora todas nuestras categorías y encuentra el postre perfecto para
          ti.
        </p>
      </header>

      {/* Categorías */}
      <main className="flex-grow bg-background backdrop-blur-md py-16 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105 focus:outline-none"
            >
              <img
                src={cat.img}
                alt={cat.nombre}
                className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-rose-700 mb-2">
                  {cat.nombre}
                </h3>
                <p className="text-gray-600 mb-4">{cat.descripcion}</p>
                <span className="bg-secundario text-texto font-semibold px-5 py-2 rounded-full shadow-md hover:bg-amber-600 transition">
                  Ver productos
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
