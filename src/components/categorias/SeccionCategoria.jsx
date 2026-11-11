import { Link } from "react-router-dom";
import TarjetaProducto from "../producto/TarjetaProducto";

// Una categoría dentro de /categorias: título, enlace "Ver todos" y las primeras fragancias.
// Props: categoria, productos (ya filtrados por esa categoría) y limite (cuántas tarjetas se muestran).
export default function SeccionCategoria({ categoria, productos, limite = 4 }) {
  const destacados = productos.slice(0, limite);

  return (
    <section className="py-4" id={`categoria-${categoria.id}`} aria-labelledby={`titulo-${categoria.id}`}>
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
        <div>
          <span className="section-label d-block">Categoría</span>
          <h2 className="luxury-title mt-2 fst-italic" id={`titulo-${categoria.id}`}>
            {categoria.nombre}
          </h2>
        </div>
        <Link
          to={`/categorias/${categoria.id}`}
          className="text-gold text-uppercase fs-7 tracking-wider text-decoration-none"
        >
          Ver todos →
        </Link>
      </div>

      {destacados.length === 0 ? (
        <p className="text-center text-gold-light py-4">Próximamente nuevas fragancias en esta categoría.</p>
      ) : (
        <div className="row g-4 justify-content-center">
          {destacados.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  );
}
