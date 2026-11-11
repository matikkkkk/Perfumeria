import { Link, useSearchParams } from "react-router-dom";
import ARTICULOS from "./articulosOriginales.json";
import ImagenEditorial from "../../components/ImagenEditorial";
import { useTemporada } from "../../context/TemporadaContext";

export { ARTICULOS };
const categoria = articulo => articulo.tema || "Fragancias";

export default function Blogs() {
  const [params, setParams] = useSearchParams();
  const { activo } = useTemporada();
  const filtro = ["Fragancias", "Cuidados", "Aprender"].includes(params.get("tema")) ? params.get("tema") : "Todos";
  const articulos = filtro === "Todos" ? ARTICULOS : ARTICULOS.filter(a => categoria(a) === filtro);
  const [destacado, ...resto] = articulos;
  return <div className="maison-editorial container">
    <header className="journal-heading">
      <div><p className="journal-signature">Maison Luxury Journal</p><h1>Historias que dejan huella.</h1></div>
      <p>Fragancias para descubrir, notas para entender y consejos para disfrutar tu colección.</p>
    </header>
    {activo && <aside className="maison-season-note"><i className="bi bi-gift" aria-hidden="true" /><p><strong>Una fragancia, un regalo personal.</strong> Descubre su estilo antes de elegir.</p><Link to="/guia-olfativa">Encontrar su familia olfativa</Link></aside>}
    <nav className="journal-filters" aria-label="Temas del blog">
      {["Todos", "Fragancias", "Cuidados", "Aprender"].map(tema => <button key={tema} type="button" aria-pressed={filtro === tema} onClick={() => setParams(prev => { const next = new URLSearchParams(prev); if (tema === "Todos") next.delete("tema"); else next.set("tema", tema); return next; }, { replace: true })}>{tema}</button>)}
      <span role="status">{articulos.length} {articulos.length === 1 ? "artículo" : "artículos"}</span>
    </nav>
    {destacado && <article className="journal-feature" key={destacado.id}>
      <Link to={`/blogs/${destacado.id}`} className="journal-feature-image" aria-label={`Leer ${destacado.titulo}`}><ImagenEditorial key={destacado.imagen} src={destacado.imagen} alt={destacado.badge} prioridad /></Link>
      <div className="journal-feature-copy"><p className="journal-category">{categoria(destacado)} <span>{destacado.meta[0]}</span></p><h2><Link to={`/blogs/${destacado.id}`}>{destacado.titulo}</Link></h2><p>{destacado.resumen}</p><Link to={`/blogs/${destacado.id}`} className="maison-text-link">Leer artículo <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link></div>
    </article>}
    <div className="journal-stories">{resto.map(articulo => <article className="journal-story" key={articulo.id}>
      <Link className="journal-story-image" to={`/blogs/${articulo.id}`} aria-label={`Leer ${articulo.titulo}`}><ImagenEditorial src={articulo.imagen} alt={articulo.badge} /></Link>
      <div><p className="journal-category">{categoria(articulo)} <span>{articulo.meta[0]}</span></p><h2><Link to={`/blogs/${articulo.id}`}>{articulo.titulo}</Link></h2><p>{articulo.resumen}</p><Link className="maison-text-link" to={`/blogs/${articulo.id}`}>Leer artículo <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link></div>
    </article>)}</div>
    <aside className="maison-discover"><div><h2>¿Por dónde empezar?</h2><p>Conoce las familias olfativas y encuentra tu próxima fragancia.</p></div><Link className="btn btn-luxury" to="/guia-olfativa">Explorar la guía olfativa</Link></aside>
  </div>;
}
