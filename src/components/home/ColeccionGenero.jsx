import { Link } from "react-router-dom";
import TarjetaProducto from "../producto/TarjetaProducto";
import { useCarrusel } from "../../hooks/useCarrusel";
import { agruparEnBloques } from "../../utils/carrusel";

const POR_SLIDE = 4;

// Una colección del home (Mujer / Hombre / Unisex): carrusel de tarjetas, 4 por slide, con botones propios.
// Props: genero ("mujer"...), etiqueta ("Colección Mujer"), titulo ("Ideal para Ellas"),
//        claseFondo (clase CSS con la imagen de fondo), id (ancla para el scroll) y productos ya filtrados.
export default function ColeccionGenero({ genero, etiqueta, titulo, claseFondo, id, productos }) {
  const bloques = agruparEnBloques(productos, POR_SLIDE);
  const { indice, siguiente, anterior } = useCarrusel(bloques.length);

  return (
    <section className={`py-5 vh-section ${claseFondo}`} id={id}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
          <div>
            <span className="section-label d-block">{etiqueta}</span>
            <h2 className="luxury-title mt-2 fst-italic">{titulo}</h2>
          </div>
          <Link to={`/productos?genero=${genero}`} className="text-gold text-uppercase fs-7 tracking-wider text-decoration-none">
            Ver todos →
          </Link>
        </div>

        <div className="carousel slide">
          <div className="carousel-inner">
            {bloques.length === 0 ? (
              <div className="carousel-item active">
                <p className="text-center text-gold-light py-4">Próximamente nuevos productos en esta colección.</p>
              </div>
            ) : (
              bloques.map((bloque, i) => (
                <div key={bloque[0].id} className={`carousel-item${i === indice ? " active" : ""}`}>
                  <div className="row g-4 justify-content-center">
                    {bloque.map((p) => (
                      <TarjetaProducto key={p.id} producto={p} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button type="button" className="btn-carousel-nav" aria-label={`Anterior, ${etiqueta}`} onClick={anterior}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="btn-carousel-nav" aria-label={`Siguiente, ${etiqueta}`} onClick={siguiente}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
