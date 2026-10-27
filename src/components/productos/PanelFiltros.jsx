import { formatearPrecio } from "../../utils/formato";
import { useState } from "react";
import { GRUPOS, opcionDeFiltro } from "../../utils/filtrosProductos";

const TITULOS = {
  categoria: "Categoría",
  ocasion: "Ocasión",
  humor: "Estado de ánimo",
  familia: "Familia olfativa",
  estacion: "Estación",
  tipo: "Tipo de perfume",
  concentracion: "Concentración",
  ml: "Capacidad (ML)",
};

// Barra lateral de filtros (aside de productos.html). No guarda la selección: la recibe y avisa los cambios,
// así la página es la dueña del estado. Lo único propio es si el panel está abierto en pantallas chicas
// (antes lo hacía data-bs-toggle="collapse").
//   opciones:  { grupo: ["valor", ...] }  lo que existe en el catálogo
//   seleccion: { grupo: ["valor", ...] }  lo que está marcado
export default function PanelFiltros({ opciones, seleccion, categorias = [], onAlternar, onLimpiar, limitesPrecio = { min: 0, max: 0 }, precioMin = 0, precioMax = 0, onPrecioMin = () => {}, onPrecioMax = () => {} }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <aside className="col-lg-3" aria-label="Filtros del catálogo">
      <button
        type="button"
        className="btn btn-luxury w-100 d-lg-none mb-3 filtros-toggle-btn"
        aria-expanded={abierto}
        aria-controls="filtrosCollapse"
        onClick={() => setAbierto((v) => !v)}
      >
        <i className="bi bi-sliders"></i> Filtros
      </button>

      <div className={`filtros-sidebar collapse d-lg-block${abierto ? " show" : ""}`} id="filtrosCollapse">
        <h4 className="filtros-titulo">Filtros</h4>

        <div className="filtro-seccion filtro-precio">
          <h5 className="filtro-seccion-titulo">Rango de precio</h5>
          <div className="d-flex justify-content-between gap-2 small text-gold-light mb-2"><span>{formatearPrecio(precioMin)}</span><span>{formatearPrecio(precioMax)}</span></div>
          <div className="rango-precio-doble" style={{ "--inicio": `${limitesPrecio.max === limitesPrecio.min ? 0 : ((precioMin - limitesPrecio.min) / (limitesPrecio.max - limitesPrecio.min)) * 100}%`, "--fin": `${limitesPrecio.max === limitesPrecio.min ? 100 : ((precioMax - limitesPrecio.min) / (limitesPrecio.max - limitesPrecio.min)) * 100}%` }}>
            <div className="rango-precio-doble__pista" aria-hidden="true"><div className="rango-precio-doble__seleccion" /></div>
            <input aria-label="Precio mínimo" id="precio-minimo" type="range" min={limitesPrecio.min} max={limitesPrecio.max} step="1000" value={precioMin} disabled={limitesPrecio.min === limitesPrecio.max} onChange={(e) => onPrecioMin(Math.min(Number(e.target.value), precioMax))} />
            <input aria-label="Precio máximo" id="precio-maximo" type="range" min={limitesPrecio.min} max={limitesPrecio.max} step="1000" value={precioMax} disabled={limitesPrecio.min === limitesPrecio.max} onChange={(e) => onPrecioMax(Math.max(Number(e.target.value), precioMin))} />
          </div>
        </div>
        {GRUPOS.filter((grupo) => (opciones[grupo] ?? []).length > 0).map((grupo) => (
          <div className="filtro-seccion" key={grupo}>
            <h5 className="filtro-seccion-titulo">{TITULOS[grupo]}</h5>
            <div
              className={`filtro-check-list${grupo === "humor" ? " filtro-check-list--humor" : ""}`}
              role="group"
              aria-label={TITULOS[grupo]}
            >
              {opciones[grupo].map((valor) => {
                const { texto, icono } = opcionDeFiltro(grupo, valor, categorias);
                return (
                  <label key={valor} className={`filtro-check${grupo === "humor" ? ` filtro-check--${valor}` : ""}`}>
                    <input
                      type="checkbox"
                      value={valor}
                      checked={(seleccion[grupo] ?? []).includes(valor)}
                      onChange={() => onAlternar(grupo, valor)}
                    />{" "}
                    {icono && <span aria-hidden="true">{icono} </span>}
                    {texto}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-luxury w-100 mt-2" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
