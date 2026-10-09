import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { CONCENTRACION, TIPO, etiquetaFamilia } from "../../utils/etiquetas";
import { formatearPrecio } from "../../utils/formato";
import ChipHumor from "./ChipHumor";

// Tarjeta del catálogo (crearTarjeta* de script.js). La usan el home, productos, categorías y ofertas.
// `columna` es la clase de grilla de Bootstrap: 4 por fila en el home, 3 por fila en productos.
export default function TarjetaProducto({ producto: p, columna = "col-12 col-md-6 col-lg-3" }) {
  const { estaEnWishlist, alternar } = useWishlist();
  const agregarAlCarrito = useAgregarAlCarrito();

  const enWishlist = estaEnWishlist(p.id);
  const stockCritico = p.stock <= p.stockCritico;

  return (
    <div className={columna}>
      <article className="card luxury-card h-100 border-0">
        <span className="card-badge card-badge--left">{CONCENTRACION[p.concentracion] || ""}</span>
        <span className="card-badge card-badge--right">{TIPO[p.tipo] || ""}</span>
        <button
          type="button"
          className={`wishlist-heart${enWishlist ? " activo" : ""}`}
          aria-label={enWishlist ? "Quitar de la wishlist" : "Guardar en wishlist"}
          aria-pressed={enWishlist}
          onClick={() => alternar(p.id)}
        >
          <i className={`bi ${enWishlist ? "bi-heart-fill" : "bi-heart"}`}></i>
        </button>
        <div className="card-img-wrapper">
          <span className="card-badge card-badge--ml">
            <i className="bi bi-cloud-fill"></i> {p.ml} ML
          </span>
          <img src={p.imagen} className="card-img-top" alt={p.nombre} />
        </div>
        <div className="card-body text-center p-4 d-flex flex-column justify-content-between">
          <div>
            {stockCritico && <span className="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>}
            <span className="fs-7 text-uppercase text-gold-light tracking-wider d-block">
              {p.estacion} · {etiquetaFamilia(p.familia)}
            </span>
            <span className="card-brand d-block fs-7 text-uppercase tracking-wider">{p.marca || ""}</span>
            <h3 className="card-title h5 luxury-title">{p.nombre}</h3>
            <div className="mood-chip-list justify-content-center mb-2">
              {(p.humor || []).map((tag) => (
                <ChipHumor key={tag} tag={tag} />
              ))}
            </div>
          </div>
          <div>
            <span className="price d-block fs-5 my-3">{formatearPrecio(p.precio)}</span>
            <Link to={`/productos/${p.id}`} className="btn btn-luxury w-100 mb-2">
              Descubrir
            </Link>
            <button type="button" className="btn btn-luxury btn-luxury--primary w-100" onClick={() => agregarAlCarrito(p)}>
              Añadir
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
