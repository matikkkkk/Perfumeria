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
export default function PanelFiltros({ opciones, seleccion, categorias = [], onAlternar, onLimpiar }) {
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
