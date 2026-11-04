import "../../styles/rangos-luxury.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BarraResultados from "../../components/productos/BarraResultados";
import PanelFiltros from "../../components/productos/PanelFiltros";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import { CatalogoSkeleton } from "../../components/skeleton/LuxurySkeletons";
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

export default function Productos() {
  const [params, setParams] = useSearchParams();
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);
  const { datos: categorias } = useRecurso(categoriasService);

  const genero = params.get("genero") ?? "";
  const buscar = params.get("buscar") ?? "";
  const [busquedaLocal, setBusquedaLocal] = useState(buscar);
  useEffect(() => setBusquedaLocal(buscar), [buscar]);
  const actualizarBusqueda = (valor) => {
    setBusquedaLocal(valor);
    setParams((anterior) => {
      const siguientes = new URLSearchParams(anterior);
      if (valor.trim()) siguientes.set("buscar", valor.trim());
      else siguientes.delete("buscar");
      return siguientes;
    }, { replace: true });
  };

  const [seleccion, setSeleccion] = useState(() => filtrosDesdeUrl(params));
  const [orden, setOrden] = useState("destacados");
  const [rangoPrecio, setRangoPrecio] = useState(null);

  const claveFiltrosUrl = GRUPOS.map((g) => params.get(g) ?? "").join("|");
  const esPrimeraVez = useRef(true);
  useEffect(() => {
    if (esPrimeraVez.current) {
      esPrimeraVez.current = false;
      return;
    }
    setSeleccion(filtrosDesdeUrl(params));
  }, [claveFiltrosUrl, params]);

  useEffect(() => {
    document.body.classList.add("productos-page");
    return () => document.body.classList.remove("productos-page");
  }, []);

  const limitesPrecio = useMemo(() => {
    const precios = productos.map((p) => Number(p.precio)).filter(Number.isFinite);
    return precios.length
      ? { min: Math.floor(Math.min(...precios) / 1000) * 1000, max: Math.ceil(Math.max(...precios) / 1000) * 1000 }
      : { min: 0, max: 0 };
  }, [productos]);
  const precioMin = rangoPrecio ? rangoPrecio.min : limitesPrecio.min;
  const precioMax = rangoPrecio ? rangoPrecio.max : limitesPrecio.max;
  const opciones = useMemo(() => opcionesDisponibles(productos), [productos]);
  const visibles = useMemo(
    () => ordenarProductos(filtrarProductos(productos, { genero, buscar, grupos: seleccion, precioMin, precioMax }), orden),
    [productos, genero, buscar, seleccion, orden, precioMin, precioMax]
  );

  const alternar = (grupo, valor) => setSeleccion((previa) => alternarValor(previa, grupo, valor));

  function limpiar() {
    setSeleccion(crearFiltrosVacios());
    setOrden("destacados");
    setRangoPrecio(null);
    setBusquedaLocal("");
    setParams(genero ? { genero } : {});
  }

  return (
    <div className="container py-5 my-4 productos-contenedor">
      <div className="text-center mb-4 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">El catálogo</span>
        <h1 className="display-4 luxury-title mt-2">Encuentra tu próximo perfume</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Explora por marca, familia olfativa o estilo. Sin apuro.</p>
      </div>

      <div className="row g-4">
        <PanelFiltros
          opciones={opciones}
          seleccion={seleccion}
          categorias={categorias}
          onAlternar={alternar}
          onLimpiar={limpiar}
          limitesPrecio={limitesPrecio}
          precioMin={precioMin}
          precioMax={precioMax}
          onPrecioMin={(min) => setRangoPrecio({ min, max: Math.max(min, precioMax) })}
          onPrecioMax={(max) => setRangoPrecio({ min: Math.min(precioMin, max), max })}
        />

        <div className="col-lg-9">
          <div className="catalogo-busqueda mb-3">
            <label htmlFor="buscarEnCatalogo" className="visually-hidden">Buscar perfumes por nombre o marca</label>
            <i className="bi bi-search" aria-hidden="true" />
            <input
              id="buscarEnCatalogo"
              type="search"
              className="form-control form-luxury"
              placeholder="Buscar por nombre o marca..."
              value={busquedaLocal}
              onChange={(evento) => actualizarBusqueda(evento.target.value)}
              autoComplete="off"
            />
          </div>

          {cargando && <CatalogoSkeleton cantidad={6} />}

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
                <div className="row g-4 justify-content-center catalogo-grid">
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
