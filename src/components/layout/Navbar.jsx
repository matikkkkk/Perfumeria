import { useEffect, useRef, useState } from "react";
import { useDropdown } from "../../hooks/useDropdown";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { useWishlist } from "../../context/WishlistContext";

const GENEROS = [
  { genero: "hombre", titulo: "Perfumes Hombre", sub: "Fragancias masculinas" },
  { genero: "mujer", titulo: "Perfumes Mujer", sub: "Fragancias femeninas" },
  { genero: "unisex", titulo: "Perfumes Unisex", sub: "Para todos" },
];

const claseLink = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

// Todo el estado del navbar (menú móvil, buscador, desplegables) es de React.
// No se usan data-bs-toggle: el JS de Bootstrap no sabe de las rutas de React Router y dejaría el menú abierto al navegar.
export default function Navbar() {
  const { usuario, estaAutenticado, esStaff } = useAuth();
  const { cantidad: enCarrito } = useCarrito();
  const { cantidad: enWishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [texto, setTexto] = useState(params.get("buscar") ?? "");

  const refInput = useRef(null);
  const rutaActual = location.pathname + location.search;
  const ddProductos = useDropdown(rutaActual);
  const ddUsuario = useDropdown(rutaActual);

  // Al navegar se cierra todo y el buscador refleja el ?buscar= de la URL (igual que el HTML).
  useEffect(() => {
    setMenuAbierto(false);
    setTexto(new URLSearchParams(location.search).get("buscar") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (buscadorAbierto) refInput.current?.focus();
  }, [buscadorAbierto]);

  function buscar(evento) {
    evento.preventDefault();
    const limpio = texto.trim();
    navigate(limpio ? `/productos?buscar=${encodeURIComponent(limpio)}` : "/productos");
    setBuscadorAbierto(false);
  }

  const nombre = usuario?.nombre || usuario?.correo || "Mi cuenta";
  const enProductos = location.pathname.startsWith("/productos");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-3 border-bottom border-secondary border-opacity-25">
      <div className="container">
        <Link className="navbar-brand brand-logo d-flex align-items-center gap-2" to="/" aria-label="Inicio">
          <span className="brand-mark-mini">ML</span>
        </Link>

        <div className="d-flex align-items-center gap-1 order-lg-3">
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Buscar"
            aria-expanded={buscadorAbierto}
            aria-controls="navSearchBox"
            onClick={() => setBuscadorAbierto((v) => !v)}
          >
            <i className="bi bi-search"></i>
          </button>

          <Link className="nav-icon-btn position-relative" to="/wishlist" aria-label={`Wishlist, ${enWishlist} productos`}>
            <i className="bi bi-heart"></i>
            <span className="nav-icon-badge wishlist-count">{enWishlist}</span>
          </Link>

          <Link className="nav-icon-btn position-relative" to="/carrito" aria-label={`Carrito, ${enCarrito} productos`}>
            <i className="bi bi-bag"></i>
            <span className="nav-icon-badge cart-count">{enCarrito}</span>
          </Link>

          {estaAutenticado ? (
            <div className="dropdown" ref={ddUsuario.ref}>
              <button
                type="button"
                className="nav-icon-btn dropdown-toggle"
                aria-label={nombre}
                title={nombre}
                aria-expanded={ddUsuario.abierto}
                onClick={ddUsuario.alternar}
              >
                <i className="bi bi-person-fill"></i>
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-luxury dropdown-menu-end${ddUsuario.abierto ? " show" : ""}`}
                data-bs-popper="static"
              >
                <li><span className="dropdown-item-text fs-7 text-gold-light">{nombre}</span></li>
                {esStaff && (
                  <li><Link className="dropdown-item" to="/admin">Panel Admin</Link></li>
                )}
                <li><Link className="dropdown-item" to="/logout">Cerrar sesión</Link></li>
              </ul>
            </div>
          ) : (
            <Link className="nav-icon-btn" to="/login" aria-label="Ingresar" title="Ingresar">
              <i className="bi bi-person"></i>
            </Link>
          )}

          <button
            type="button"
            className="navbar-toggler border-0"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse order-lg-2${menuAbierto ? " show" : ""}`}>
          <ul className="navbar-nav mx-lg-auto mb-2 mb-lg-0 gap-lg-3 text-uppercase fs-7 tracking-wider">
            <li className="nav-item">
              <NavLink className={claseLink} to="/" end>Home</NavLink>
            </li>
            <li className="nav-item dropdown" ref={ddProductos.ref}>
              <button
                type="button"
                className={`nav-link dropdown-toggle bg-transparent border-0${enProductos ? " active" : ""}`}
                aria-expanded={ddProductos.abierto}
                onClick={ddProductos.alternar}
              >
                Productos
              </button>
              <ul className={`dropdown-menu dropdown-menu-luxury${ddProductos.abierto ? " show" : ""}`} data-bs-popper="static">
                <li>
                  <Link className="dropdown-item" to="/productos">
                    <span className="dropdown-item-title">Todos</span>
                    <span className="dropdown-item-sub">Catálogo completo</span>
                  </Link>
                </li>
                {GENEROS.map((g) => (
                  <li key={g.genero}>
                    <Link className="dropdown-item" to={`/productos?genero=${g.genero}`}>
                      <span className="dropdown-item-title">{g.titulo}</span>
                      <span className="dropdown-item-sub">{g.sub}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item"><NavLink className={claseLink} to="/categorias">Categorías</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/blogs">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/contacto">Contacto</NavLink></li>
          </ul>
        </div>
      </div>

      <div className={`nav-search-box collapse${buscadorAbierto ? " show" : ""}`} id="navSearchBox">
        <div className="container py-3">
          <form className="d-flex gap-2" role="search" onSubmit={buscar}>
            <input
              ref={refInput}
              type="text"
              className="form-control form-luxury"
              placeholder="Buscar perfumes, marcas..."
              autoComplete="off"
              aria-label="Buscar perfumes"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit" className="btn btn-luxury" aria-label="Buscar">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
