// Botones para filtrar las ofertas por etiqueta ("Verano", "Liquidación"...). No guarda estado:
// la página decide cuál está elegida (`seleccionada`, "" = todas) y recibe el clic por `onSeleccionar`.
export default function EtiquetasOferta({ etiquetas, seleccionada = "", onSeleccionar }) {
  if (etiquetas.length === 0) return null;

  const opciones = [{ valor: "", texto: "Todas" }, ...etiquetas.map((e) => ({ valor: e, texto: e }))];

  return (
    <div className="d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filtrar ofertas por etiqueta">
      {opciones.map((o) => {
        const activa = o.valor === seleccionada;
        return (
          <button
            key={o.valor || "todas"}
            type="button"
            className={`btn btn-sm btn-luxury${activa ? " btn-luxury--primary" : ""}`}
            aria-pressed={activa}
            onClick={() => onSeleccionar(o.valor)}
          >
            {o.texto}
          </button>
        );
      })}
    </div>
  );
}
