import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { menuParaUsuario } from "../../routes/menuAdmin";
import ScrollToTop from "./ScrollToTop";

// Marco mínimo del panel (cabecera + menú lateral filtrado por rol + contenido).
// La etapa 11 lo completa (tarjetas del dashboard, íconos, responsive fino).
// Siempre se renderiza dentro de <RutaProtegida roles={ROLES_STAFF}>, así que `usuario` existe.
export default function LayoutAdmin() {
  const { usuario } = useAuth();
  const menu = menuParaUsuario(usuario);

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <header>
        <nav className="navbar navbar-dark bg-transparent py-3 border-bottom border-secondary border-opacity-25">
          <div className="container">
            <Link className="navbar-brand brand-logo" to="/admin">LUXURY ADMIN</Link>
            <div className="d-flex align-items-center gap-3">
              <span className="fs-7 text-gold-light d-none d-sm-inline">
                {usuario?.nombre || usuario?.correo} · {usuario?.tipo}
              </span>
              <Link className="btn btn-luxury" to="/">Tienda</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <aside className="col-md-3 col-lg-2 admin-menu py-4">
            {menu.map((opcion) => (
              <NavLink key={opcion.to} to={opcion.to} end={opcion.end} className={({ isActive }) => (isActive ? "active" : undefined)}>
                {opcion.etiqueta}
              </NavLink>
            ))}
            <Link to="/logout" className="logout-link">Cerrar sesión</Link>
          </aside>
          <main className="col-md-9 col-lg-10 p-4 p-md-5">
            <Outlet />
          </main>
        </div>
      </div>

      <footer className="site-footer">
        <div className="container text-center">
          <span>© 2026 Luxury — Sistema administrativo</span>
        </div>
      </footer>
    </div>
  );
}
