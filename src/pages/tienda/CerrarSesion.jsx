import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Ruta /logout: cierra la sesión y vuelve al inicio.
// El panel enlaza aquí en vez de cerrar la sesión estando dentro de /admin: si se borrara el usuario
// mientras RutaProtegida sigue montada, esta redirigiría a /login antes de llegar al inicio.
export default function CerrarSesion() {
  const { cerrarSesion } = useAuth();
  useEffect(() => {
    cerrarSesion();
  }, [cerrarSesion]);
  return <Navigate to="/" replace />;
}
