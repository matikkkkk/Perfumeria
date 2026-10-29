import { Link } from "react-router-dom";
const colecciones = [
  {tipo:"arabe", titulo:"Árabes", subtitulo:"Tradición, intensidad y carácter.", clase:"arabe"},
  {tipo:"disenador", titulo:"Diseñador", subtitulo:"Iconos que marcan tendencia.", clase:"disenador"},
  {tipo:"nicho", titulo:"Nicho", subtitulo:"Arte, exclusividad y composiciones únicas.", clase:"nicho"},
];
export default function ColeccionesLuxury() {
  return <section className="luxury-curated-section" id="colecciones"><div className="container">
    <div className="text-center mb-4"><span className="section-label">Colecciones exclusivas</span><h2 className="luxury-title fst-italic mt-2">Tres mundos, una pasión</h2></div>
    <div className="row g-4">{colecciones.map(c=><div className="col-md-4" key={c.tipo}><Link className={`luxury-editorial-card luxury-editorial-card--${c.clase}`} to={`/productos?tipo=${c.tipo}`}><span className="luxury-editorial-shade"><span className="section-label">Perfumes</span><strong>{c.titulo}</strong><small>{c.subtitulo}</small><span className="luxury-card-action">Explorar <i className="bi bi-arrow-right" /></span></span></Link></div>)}</div>
  </div></section>;
}
