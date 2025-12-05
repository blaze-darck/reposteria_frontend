import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className={"text-2xl font-bold trackinf-tighter transition-all"}
    >
      <p className="hidden lg:block text-[#0f6c73]">
        DULCE
        <span className="text-[#0f6c73]"> TENTACION</span>
      </p>
      <p className="flex text-4x1 lg:hidden">
        <span className="-skew-x-6">DULCE</span>
        <span className="text-[#0f6c73] skew-x-6"> TENTACION</span>
      </p>
    </Link>
  );
};
