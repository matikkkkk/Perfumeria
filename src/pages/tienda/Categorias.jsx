import SeccionCategoria from "../../components/categorias/SeccionCategoria";
import TarjetaCategoria from "../../components/categorias/TarjetaCategoria";
import { useRecurso } from "../../hooks/useRecurso";
import { categoriasService } from "../../services/categoriasService";
import { productosService } from "../../services/productosService";
import { productosDeCategoria } from "../../utils/categorias";

// Categorías (Figura 4): arriba una tarjeta por categoría y debajo una sección con sus primeras fragancias.
// Las categorías vienen de GET /categorias y los productos de GET /productos; el cruce se hace aquí con producto.categoria.
export default function Categorias() {
  const cat = useRecurso(categoriasService);
  const prod = useRecurso(productosService);

  const cargando = cat.cargando || prod.cargando;
  const error = cat.error || prod.error;

  function recargar() {
    cat.recargar();
    prod.recargar();
  }

  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">Intensidad</span>
        <h1 className="display-4 luxury-title mt-2">Categorías</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Elige cuánta presencia quieres dejar.</p>
      </div>

      {cargando && (
        <p className="text-center text-gold-light py-5 mb-0" role="status">
          Cargando categorías...
        </p>
      )}

      {error && (
        <div className="text-center py-5" role="alert">
          <p className="text-gold-light">No pudimos cargar las categorías. Revisa que la API esté encendida.</p>
          <button type="button" className="btn btn-luxury" onClick={recargar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="row g-4 justify-content-center mb-5">
            {cat.datos.map((c) => (
              <TarjetaCategoria key={c.id} categoria={c} total={productosDeCategoria(prod.datos, c.id).length} />
            ))}
          </div>

          {cat.datos.map((c) => (
            <SeccionCategoria key={c.id} categoria={c} productos={productosDeCategoria(prod.datos, c.id)} />
          ))}
        </>
      )}
    </div>
  );
}
