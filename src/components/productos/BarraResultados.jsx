import { ORDENES, textoResultado } from "../../utils/filtrosProductos";

// Línea sobre la grilla: cuántos productos hay y el selector de orden.
export default function BarraResultados({ total, buscar = "", orden, onOrdenar }) {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <span className="text-gold-light fs-7" role="status">
        {textoResultado(total, buscar)}
      </span>
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="ordenarSelect" className="text-gold-light fs-7 mb-0">
          Ordenar:
        </label>
        <select
          id="ordenarSelect"
          className="form-select form-luxury form-select-sm sort-select"
          value={orden}
          onChange={(e) => onOrdenar(e.target.value)}
        >
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
