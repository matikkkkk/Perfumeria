import "../../styles/rangos-luxury.css";
export default function RangoFechas({ desde, hasta, onDesde, onHasta }) {
  return <div className="admin-panel mb-4" aria-label="Filtrar por rango de fechas">
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <div><strong className="text-gold">Filtrar por fechas</strong><p className="small text-gold-light mb-0">Incluye tanto el día inicial como el final (BETWEEN).</p></div>
      <button type="button" className="btn btn-sm btn-outline-light" onClick={() => { onDesde(""); onHasta(""); }}>Quitar rango</button>
    </div>
    <div className="row g-3">
      <div className="col-12 col-md-6"><label className="form-label" htmlFor="rango-desde">Desde</label><input id="rango-desde" className="form-control admin-input" type="date" value={desde} max={hasta || undefined} onChange={(e) => onDesde(e.target.value)} /></div>
      <div className="col-12 col-md-6"><label className="form-label" htmlFor="rango-hasta">Hasta</label><input id="rango-hasta" className="form-control admin-input" type="date" value={hasta} min={desde || undefined} onChange={(e) => onHasta(e.target.value)} /></div>
    </div>
    {desde && hasta && desde > hasta && <p role="alert" className="text-warning small mt-2 mb-0">La fecha inicial no puede superar la final.</p>}
  </div>;
}
