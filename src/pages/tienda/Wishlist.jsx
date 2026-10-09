import ListaWishlist from "../../components/wishlist/ListaWishlist";
import { useWishlist } from "../../context/WishlistContext";
import { useRecurso } from "../../hooks/useRecurso";
import { productosService } from "../../services/productosService";

// Wishlist (wishlist.html). El contexto solo guarda ids; los datos de cada perfume se piden a la API
// para que precio y stock estén al día. Sin ids guardados no hace falta esperar a la API.
export default function Wishlist() {
  const { ids } = useWishlist();
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);
  const hayGuardados = ids.length > 0;

  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <span className="text-gold text-uppercase tracking-widest fs-7">Mis favoritos</span>
        <h1 className="display-5 luxury-title fst-italic mt-2">Wishlist</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Fragancias guardadas</p>
      </div>

      {hayGuardados && cargando && (
        <p className="text-center text-gold-light py-5 mb-0" role="status">
          Cargando fragancias...
        </p>
      )}

      {hayGuardados && error && (
        <div className="text-center py-5" role="alert">
          <p className="text-gold-light">No pudimos cargar tus favoritos. Revisa que la API esté encendida.</p>
          <button type="button" className="btn btn-luxury" onClick={recargar}>Reintentar</button>
        </div>
      )}

      {(!hayGuardados || (!cargando && !error)) && <ListaWishlist productos={productos} />}
    </div>
  );
}
