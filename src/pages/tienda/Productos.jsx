import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BarraResultados from "../../components/productos/BarraResultados";
import PanelFiltros from "../../components/productos/PanelFiltros";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import { useRecurso } from "../../hooks/useRecurso";
import { categoriasService } from "../../services/categoriasService";
import { productosService } from "../../services/productosService";
import {
  GRUPOS,
  alternarValor,
  crearFiltrosVacios,
  filtrarProductos,
  filtrosDesdeUrl,
  opcionesDisponibles,
  ordenarProductos,
} from "../../utils/filtrosProductos";

// Catálogo (productos.html). Qué va dónde:
//   - Filtros de panel y orden: estado de ESTA página (useState).
//   - Género y búsqueda: query params (?genero=, ?buscar=). El buscador del Navbar solo navega a /productos?buscar=...
//     y esta página lo lee, igual que el HTML, así no hace falta un contexto compartido.
//   - ?categoria=intensos (y los demás grupos) preseleccionan filtros al llegar desde otras vistas.
export default function Productos() {
  const [params, setParams] = useSearchParams();
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);
  const { datos: categorias } = useRecurso(categoriasService); // solo da los nombres; si falla se muestra el id

  const genero = params.get("genero") ?? "";
  const buscar = params.get("buscar") ?? "";

  const [seleccion, setSeleccion] = useState(() => filtrosDesdeUrl(params));
  const [orden, setOrden] = useState("destacados");

  // Si llegan nuevos ?categoria=/?humor=... con la página ya abierta, se actualiza la selección.
  const claveFiltrosUrl = GRUPOS.map((g) => params.get(g) ?? "").join("|");
  const esPrimeraVez = useRef(true);
  useEffect(() => {
    if (esPrimeraVez.current) {
      esPrimeraVez.current = false;
      return;
    }
    setSeleccion(filtrosDesdeUrl(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveFiltrosUrl]);

  // El CSS del catálogo (fondo y panel de filtros) cuelga de la clase productos-page del <body>.
  useEffect(() => {
    document.body.classList.add("productos-page");
    return () => document.body.classList.remove("productos-page");
  }, []);

  const opciones = useMemo(() => opcionesDisponibles(productos), [productos]);
  const visibles = useMemo(
    () => ordenarProductos(filtrarProductos(productos, { genero, buscar, grupos: seleccion }), orden),
    [productos, genero, buscar, seleccion, orden]
  );

  const alternar = (grupo, valor) => setSeleccion((previa) => alternarValor(previa, grupo, valor));

  // Igual que "Limpiar filtros" del HTML: borra checks, vuelve a "Destacados" y deja solo ?genero= en la URL.
  function limpiar() {
    setSeleccion(crearFiltrosVacios());
    setOrden("destacados");
    setParams(genero ? { genero } : {});
  }

  return (
    <div className="container py-5 my-4 productos-contenedor">
      <div className="text-center mb-4 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">Colección Luxury</span>
        <h1 className="display-4 luxury-title mt-2">Nuestros productos</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Elige una fragancia y añádela a tu carrito.</p>
      </div>

      <div className="row g-4">
        <PanelFiltros
          opciones={opciones}
          seleccion={seleccion}
          categorias={categorias}
          onAlternar={alternar}
          onLimpiar={limpiar}
        />

        <div className="col-lg-9">
          {cargando && (
            <p className="text-center text-gold-light py-5 mb-0" role="status">
              Cargando fragancias...
            </p>
          )}

          {error && (
            <div className="text-center py-5" role="alert">
              <p className="text-gold-light">No pudimos cargar los productos. Revisa que la API esté encendida.</p>
              <button type="button" className="btn btn-luxury" onClick={recargar}>
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && (
            <>
              <BarraResultados total={visibles.length} buscar={buscar} orden={orden} onOrdenar={setOrden} />

              {visibles.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-gold-light">No encontramos fragancias con esos criterios.</p>
                  <button type="button" className="btn btn-luxury" onClick={limpiar}>
                    Quitar filtros
                  </button>
                </div>
              ) : (
                <div className="row g-4 justify-content-center">
                  {visibles.map((p) => (
                    <TarjetaProducto key={p.id} producto={p} columna="col-12 col-md-6 col-lg-4" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
