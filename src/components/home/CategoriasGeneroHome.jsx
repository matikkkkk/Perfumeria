import { Link } from "react-router-dom";
const categorias = [
  {genero:"mujer",titulo:"Para Ellas",texto:"Elegancia, dulzura y carácter."},
  {genero:"hombre",titulo:"Para Ellos",texto:"Fuerza, estilo y presencia."},
  {genero:"unisex",titulo:"Unisex",texto:"Fragancias sin etiquetas."},
];
export default function CategoriasGeneroHome() {
  return <section className="luxury-gender-section"><div className="container"><div className="text-center mb-4"><span className="section-label">Encuentra tu fragancia</span><h2 className="luxury-title fst-italic mt-2">Para cada estilo, una esencia</h2></div>
  <div className="row g-4">{categorias.map(c=><div className="col-md-4" key={c.genero}><Link to={`/productos?genero=${c.genero}`} className={`luxury-editorial-card luxury-gender-card--${c.genero}`}><span className="luxury-editorial-shade"><strong>{c.titulo}</strong><small>{c.texto}</small><span className="luxury-card-action">Explorar <i className="bi bi-arrow-right" /></span></span></Link></div>)}</div></div></section>;
}
