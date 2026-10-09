import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import TarjetaProducto from "../producto/TarjetaProducto";

function WishlistVacia() {
  return (
    <div className="text-center py-5">
      <i className="bi bi-heart wishlist-empty-icon" aria-hidden="true"></i>
      <p className="luxury-title fst-italic h4 mt-3 mb-1">Tu wishlist está vacía</p>
      <p className="text-gold-light">Guarda las fragancias que te enamoran con el corazón en cada producto</p>
      <Link to="/productos" className="btn btn-luxury mt-3">Explorar fragancias</Link>
    </div>
  );
}

// Grilla de favoritos: recibe todos los productos y muestra solo los guardados en la wishlist (los ids vienen del contexto).
// Como el corazón de cada tarjeta cambia esos mismos ids, la tarjeta desaparece de la grilla al quitarla; sin ninguna, aparece el aviso.
export default function ListaWishlist({ productos }) {
  const { ids } = useWishlist();
  const guardados = productos.filter((p) => ids.includes(p.id));

  if (guardados.length === 0) return <WishlistVacia />;

  return (
    <div className="row g-4 justify-content-center">
      {guardados.map((p) => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </div>
  );
}
