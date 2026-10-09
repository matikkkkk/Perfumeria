import { Link } from "react-router-dom";
import InspiradoEn from "../producto/InspiradoEn";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { useCarrusel } from "../../hooks/useCarrusel";
import { etiquetaFamilia } from "../../utils/etiquetas";
import { formatearPrecio } from "../../utils/formato";

const INTERVALO_MS = 6000; // data-bs-interval del HTML

const mayuscula = (texto = "") => texto.charAt(0).toUpperCase() + texto.slice(1);

// Carrusel grande de "Nuevos Lanzamientos": un producto por slide, avanza solo cada 6 s.
export default function NuevosLanzamientos({ productos }) {
  const agregarAlCarrito = useAgregarAlCarrito();
  const { indice, siguiente, anterior, ir } = useCarrusel(productos.length, INTERVALO_MS);

  return (
    <section className="container py-5 vh-section" aria-labelledby="titulo-lanzamientos">
      <div className="text-center mb-4">
        <span className="section-label d-block">Recién llegados</span>
        <h2 id="titulo-lanzamientos" className="luxury-title mt-2 fst-italic">
          Nuevos Lanzamientos
        </h2>
      </div>

      <div className="carousel slide launch-carousel">
        <div className="carousel-inner">
          {productos.map((p, i) => (
            <div key={p.id} className={`carousel-item${i === indice ? " active" : ""}`}>
              <div className="row g-0 align-items-center launch-slide">
                <div className="col-md-6 launch-img-wrapper">
                  <img src={p.imagen} alt={p.nombre} className="launch-img" />
                </div>
                <div className="col-md-6 p-4 p-lg-5">
                  <span className="text-gold text-uppercase fs-7 tracking-wider">Nuevo · {mayuscula(p.estacion)}</span>
                  <span className="d-block fs-7 text-uppercase tracking-wider text-gold-light mt-1">{p.marca || ""}</span>
                  <h3 className="luxury-title launch-title fst-italic display-6 mt-2">{p.nombre}</h3>
                  <p className="text-gold-light my-3">{p.descripcion}</p>
                  <InspiradoEn producto={p} />
                  <p className="fs-7 text-uppercase text-gold tracking-wider mb-3 mt-2">
                    Familia: <span className="text-gold-light">{etiquetaFamilia(p.familia)}</span>
                  </p>
                  <h4 className="price launch-price mb-3">{formatearPrecio(p.precio)}</h4>
                  <Link to={`/productos/${p.id}`} className="btn btn-luxury me-2">
                    Ver producto
                  </Link>
                  <button type="button" className="btn btn-luxury btn-luxury--fill" onClick={() => agregarAlCarrito(p)}>
                    Añadir al carrito <i className="bi bi-bag ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="carousel-control-prev carousel-control-luxury" onClick={anterior}>
          <i className="bi bi-chevron-left"></i>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button type="button" className="carousel-control-next carousel-control-luxury" onClick={siguiente}>
          <i className="bi bi-chevron-right"></i>
          <span className="visually-hidden">Siguiente</span>
        </button>
        <div className="carousel-indicators carousel-indicators-luxury">
          {productos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={i === indice ? "active" : ""}
              aria-current={i === indice ? "true" : undefined}
              aria-label={`Ir al lanzamiento ${i + 1}`}
              onClick={() => ir(i)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
