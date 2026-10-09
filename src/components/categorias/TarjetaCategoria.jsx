import { Link } from "react-router-dom";
import { textoFragancias } from "../../utils/categorias";

// Tarjeta de una categoría (imagen, nombre, descripción y cuántas fragancias tiene). Lleva a /categorias/:id.
// Props: categoria ({ id, nombre, descripcion, imagen }) y total (cantidad de productos de esa categoría).
export default function TarjetaCategoria({ categoria, total }) {
  const destino = `/categorias/${categoria.id}`;

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <article className="card luxury-card categoria-card h-100 border-0">
        <img src={categoria.imagen} className="categoria-card__img" alt={categoria.nombre} />
        <div className="card-body text-center p-4 d-flex flex-column">
          <span className="section-label d-block">{textoFragancias(total)}</span>
          <h3 className="card-title h4 luxury-title mt-2">{categoria.nombre}</h3>
          <p className="text-gold-light fs-7 flex-grow-1">{categoria.descripcion}</p>
          <Link to={destino} className="btn btn-luxury w-100">
            Ver {categoria.nombre}
          </Link>
        </div>
      </article>
    </div>
  );
}
