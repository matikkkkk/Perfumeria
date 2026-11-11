import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BarraResultados from "../../components/productos/BarraResultados";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import { useRecurso } from "../../hooks/useRecurso";
import { categoriasService } from "../../services/categoriasService";
import { productosService } from "../../services/productosService";
import { productosDeCategoria } from "../../utils/categorias";
import { ordenarProductos } from "../../utils/filtrosProductos";

// Categoría #N (Figura 3): todas las fragancias de una categoría, con el mismo selector de orden del catálogo.
// Si el id no existe en /categorias se muestra "Categoría no encontrada"; "Afinar con filtros" abre el catálogo ya filtrado.
export default function CategoriaDetalle() {
  const { id } = useParams();
  const cat = useRecurso(categoriasService);
  const prod = useRecurso(productosService);
  const [orden, setOrden] = useState("destacados");

  const cargando = cat.cargando || prod.cargando;
  const error = cat.error || prod.error;
  const categoria = cat.datos.find((c) => c.id === id);

  const visibles = useMemo(() => ordenarProductos(productosDeCategoria(prod.datos, id), orden), [prod.datos, id, orden]);

  function recargar() {
    cat.recargar();
    prod.recargar();
  }

  if (cargando) {
    return (
      <p className="text-center text-gold-light py-5 mb-0" role="status">
        Cargando categoría...
      </p>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center" role="alert">
        <p className="text-gold-light">No pudimos cargar la categoría. Revisa que la API esté encendida.</p>
        <button type="button" className="btn btn-luxury" onClick={recargar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="container py-5">
        <div className="alert alert-luxury" role="alert">Categoría no encontrada.</div>
        <Link to="/categorias" className="btn btn-luxury">Ver todas las categorías</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-4 hero-header">
        <Link to="/categorias" className="text-gold text-uppercase fs-7 tracking-wider text-decoration-none">
          ← Todas las categorías
        </Link>
        <h1 className="display-4 luxury-title mt-3">{categoria.nombre}</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">{categoria.descripcion}</p>
        <Link to={`/productos?categoria=${categoria.id}`} className="btn btn-luxury">
          Afinar con filtros
        </Link>
      </div>

      <BarraResultados total={visibles.length} orden={orden} onOrdenar={setOrden} />

      {visibles.length === 0 ? (
        <p className="text-center text-gold-light py-5">Próximamente nuevas fragancias en esta categoría.</p>
      ) : (
        <div className="row g-4 justify-content-center">
          {visibles.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
