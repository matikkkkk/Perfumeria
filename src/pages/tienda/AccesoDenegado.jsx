import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AccesoDenegado() {
  const { esStaff } = useAuth();
  return (
    <section className="container py-5 text-center">
      <span className="section-label d-block">Error 403</span>
      <h1 className="luxury-title fst-italic mt-2">Acceso denegado</h1>
      <div className="gold-divider mx-auto my-3"></div>
      <p className="text-gold-light">Tu perfil no tiene permiso para ver esta sección.</p>
      <Link className="btn btn-luxury" to={esStaff ? "/admin" : "/"}>
        {esStaff ? "Volver al panel" : "Volver al inicio"}
      </Link>
    </section>
  );
}
