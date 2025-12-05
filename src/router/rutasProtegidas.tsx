import { Navigate, Outlet } from "react-router-dom";

interface Props {
  roles?: string[];
}

export default function ProtectedRoute({ roles }: Props) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    roles &&
    (!usuario.roles || !usuario.roles.some((r: string) => roles.includes(r)))
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
