import { estrellas, iniciales, promedioResenas } from "../../utils/productoDetalle";

// Reseñas (renderReviews): promedio arriba y una tarjeta por reseña recibida.
export default function ResenasProducto({ resenas }) {
  return (
    <section className="reviews-section">
      <div className="container">
        <div className="text-center mb-4">
          <span className="text-tema-dorado text-uppercase tracking-wider fs-7">Reseñas</span>
          <h3 className="luxury-title fst-italic mb-1">
            {promedioResenas(resenas)} <span className="estrellas" aria-hidden="true">★</span>
            <span className="visually-hidden"> de 5 estrellas de promedio</span>
          </h3>
        </div>
        <div className="row g-4">
          {resenas.map((r) => (
            <div className="col-md-4" key={r.nombre}>
              <article className="review-card">
                <span className="estrellas" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                  {estrellas(r.estrellas)}
                </span>
                <p>“{r.texto}”</p>
                <div className="d-flex align-items-center gap-2 mt-3">
                  <span className="review-avatar" aria-hidden="true">{iniciales(r.nombre)}</span>
                  <span className="review-nombre">{r.nombre}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
