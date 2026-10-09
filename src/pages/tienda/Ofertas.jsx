import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EtiquetasOferta from "../../components/ofertas/EtiquetasOferta";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import BarraResultados from "../../components/productos/BarraResultados";
import { useRecurso } from "../../hooks/useRecurso";
import { ofertasService } from "../../services/ofertasService";
import { productosService } from "../../services/productosService";
import { etiquetasDeOfertas, filtrarPorEtiqueta, ordenarOfertas, productosEnOferta } from "../../utils/ofertas";

// Ofertas (Figura 3): todos los productos con una oferta vigente. Las ofertas vienen de GET /ofertas y los productos
// de GET /productos; el cruce y el precio con descuento se calculan en utils/ofertas.js.
// Estado de la página: etiqueta elegida y orden. "Añadir" mete el producto al carrito con el precio de oferta.
export default function Ofertas() {
  const ofe = useRecurso(ofertasService);
  const prod = useRecurso(productosService);
  const [etiqueta, setEtiqueta] = useState("");
  const [orden, setOrden] = useState("destacados");

  const cargando = ofe.cargando || prod.cargando;
  const error = ofe.error || prod.error;

  const enOferta = useMemo(() => productosEnOferta(ofe.datos, prod.datos), [ofe.datos, prod.datos]);
  const etiquetas = useMemo(() => etiquetasDeOfertas(enOferta), [enOferta]);
  const visibles = useMemo(
    () => ordenarOfertas(filtrarPorEtiqueta(enOferta, etiqueta), orden),
    [enOferta, etiqueta, orden]
  );

  function recargar() {
    ofe.recargar();
    prod.recargar();
  }

  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-4 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">Precios especiales</span>
        <h1 className="display-4 luxury-title mt-2">Ofertas</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Fragancias con descuento por tiempo limitado.</p>
      </div>

      {cargando && (
        <p className="text-center text-gold-light py-5 mb-0" role="status">
          Cargando ofertas...
        </p>
      )}

      {error && (
        <div className="text-center py-5" role="alert">
          <p className="text-gold-light">No pudimos cargar las ofertas. Revisa que la API esté encendida.</p>
          <button type="button" className="btn btn-luxury" onClick={recargar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && enOferta.length === 0 && (
        <div className="text-center py-5">
          <p className="text-gold-light">No hay ofertas vigentes por ahora.</p>
          <Link to="/productos" className="btn btn-luxury">
            Ver todos los productos
          </Link>
        </div>
      )}

      {!cargando && !error && enOferta.length > 0 && (
        <>
          <EtiquetasOferta etiquetas={etiquetas} seleccionada={etiqueta} onSeleccionar={setEtiqueta} />
          <BarraResultados total={visibles.length} orden={orden} onOrdenar={setOrden} />

          {visibles.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-gold-light">No hay ofertas con esa etiqueta.</p>
              <button type="button" className="btn btn-luxury" onClick={() => setEtiqueta("")}>
                Ver todas
              </button>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {visibles.map(({ producto, oferta, precioOferta }) => (
                <TarjetaProducto
                  key={producto.id}
                  producto={producto}
                  oferta={{
                    descuento: oferta.descuento,
                    etiqueta: oferta.etiqueta,
                    vigenteHasta: oferta.vigenteHasta,
                    precioOferta,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
