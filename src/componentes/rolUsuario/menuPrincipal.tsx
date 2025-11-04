export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-yellow-100 text-texto">
      {/* Contenido principal */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold text-texto mb-4">
          Bienvenido a Dulce Encanto
        </h2>
        <p className="text-lg text-texto max-w-md mb-6">
          Repostería artesanal hecha con amor.Pasteles, cupcakes y postres que
          endulzan tus momentos más especiales.
        </p>
      </main>
    </div>
  );
}
