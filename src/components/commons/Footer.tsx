import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-16 bg-gray-950 px-12 flex justify-between gap-10 text-slate-200 text-sm flex-wrap mt-10 md:flex-nowrap">
      <Link
        to="/articulos"
        className={`text-2xl font-bold tracking-tighter transition-all text-white flex-1`}
      >
        Wally Suma
      </Link>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          Correo Electronico
        </p>
        <p className="text-xs font-medium">djdiegoguisbert@gmail.com</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          Datos a Poner
        </p>

        <nav className="flex flex-col gap-2 text-xs font-medium">
          <p>diego</p>
          <p className="text-slate-300">nose que poner</p>
          <p className="text-slate-300">:v</p>
        </nav>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">Contactanos</p>
        <img className="w-32 h-32" src="../Contactos.jpeg" alt="Logo" />
      </div>
    </footer>
  );
};
