import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { menuParaUsuario } from "../../routes/menuAdmin";
import ScrollToTop from "./ScrollToTop";

const iconosMenu = {
  Dashboard: "bi-grid-1x2",
  Órdenes: "bi-receipt",
  Productos: "bi-droplet",
  Categorías: "bi-tags",
  Usuarios: "bi-people",
  Reportes: "bi-bar-chart-line",
  Perfil: "bi-person-circle",
};

export default function LayoutAdmin() {
  const { usuario } = useAuth();
  const menu = menuParaUsuario(usuario);

  return <div className="d-flex flex-column min-vh-100">
    <ScrollToTop />
    <header className="admin-header">
      <nav className="navbar navbar-dark py-3 border-bottom border-secondary border-opacity-25">
        <div className="container-fluid px-3 px-lg-4">
          <Link className="navbar-brand brand-logo" to="/admin" aria-label="Luxury, inicio de administración">LUXURY <span className="d-none d-sm-inline">ADMIN</span></Link>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <div className="text-end d-none d-sm-block"><span className="d-block text-gold-light small">Sesión iniciada</span><strong className="small">{usuario?.nombre || usuario?.correo}</strong><span className="text-secondary small ms-2">{usuario?.tipo}</span></div>
            <Link className="btn btn-luxury btn-sm" to="/" aria-label="Volver a la tienda"><i className="bi bi-shop me-sm-2"/><span className="d-none d-sm-inline">Tienda</span></Link>
          </div>
        </div>
      </nav>
    </header>

    <div className="container-fluid flex-grow-1 px-0">
      <div className="row g-0 h-100">
        <aside className="col-12 col-md-3 col-lg-2 admin-menu py-4" aria-label="Menú de administración">
          <div className="d-none d-md-block px-3 mb-3"><span className="admin-eyebrow mb-0">MENÚ PRINCIPAL</span></div>
          <nav className="admin-menu-links" aria-label="Menú de administración">{menu.map((opcion) => <NavLink key={opcion.to} to={opcion.to} end={opcion.end} className={({ isActive }) => isActive ? "active" : undefined}><i className={`bi ${iconosMenu[opcion.etiqueta] || "bi-circle"}`} aria-hidden="true"/><span>{opcion.etiqueta}</span></NavLink>)}</nav>
          <Link to="/logout" className="logout-link"><i className="bi bi-box-arrow-left me-2"/>Cerrar sesión</Link>
        </aside>
        <main className="col-12 col-md-9 col-lg-10 p-3 p-lg-5"><Outlet /></main>
      </div>
    </div>

    <footer className="site-footer"><div className="container text-center"><span>© 2026 Luxury — Sistema administrativo</span></div></footer>
  </div>;
}
