import { Link, useParams } from "react-router-dom";
import ARTICULOS from "./articulosOriginales.json";
import ImagenEditorial from "../../components/ImagenEditorial";

export default function DetalleBlog() {
  const { id } = useParams();
  const articulo = ARTICULOS.find((item) => item.id === id);
  if (!articulo) return <div className="container py-5 text-center"><h1>Artículo no encontrado</h1><Link to="/blogs" className="btn btn-luxury">Volver a Blogs</Link></div>;

  return (
    <div className="container maison-editorial maison-reading">
      <article className="maison-article">
        <Link to="/blogs" className="text-gold-light d-inline-block mb-3"><i className="bi bi-arrow-left me-2" />Volver a Blogs</Link>
        <h1 className="luxury-title blog-title">{articulo.titulo}</h1>
        <div className="blog-meta">
          {articulo.meta.map((dato, i) => <span key={dato}><i aria-hidden="true" className={`bi bi-${i === 0 ? "clock" : i === 1 ? "droplet" : "person"}`} />{dato}</span>)}
        </div>
        <div className="blog-hero-frame"><ImagenEditorial key={articulo.imagen} src={articulo.imagen} alt={articulo.badge} prioridad /><span className="blog-hero-badge">{articulo.badge}</span></div>
        <nav className="article-index" aria-label="En este artículo"><strong>En este artículo</strong>{articulo.blocks.map((bloque, i) => bloque.type === "heading" ? <a key={i} href={`#seccion-${i}`}>{bloque.text}</a> : null)}</nav>
        <div className="article-prose">{articulo.blocks.map((bloque, i) => {
          if (bloque.type === "heading") return <h2 id={`seccion-${i}`} className="blog-subhead" key={i}>{bloque.text}</h2>;
          if (bloque.type === "notes") return <div className="notes-block" key={i}>{bloque.groups.map((grupo) => <div className="notes-row" key={grupo.label}><span className="note-pill-label w-100">{grupo.label}</span>{grupo.notes.map((nota) => <span className="note-pill" key={nota}>{nota}</span>)}</div>)}</div>;
          return <p key={i} className={bloque.type === "lead" ? "blog-lead" : "luxury-blog-paragraph"}>{bloque.text}</p>;
        })}</div>
        {articulo.producto ? <div className="blog-cta-card">
          <ImagenEditorial src={articulo.producto.imagen} alt={articulo.producto.titulo} className="blog-cta-img" />
          <div className="blog-cta-text"><span className="cta-eyebrow">Disponible en LUXURY</span><h2>{articulo.producto.titulo}</h2><p>{articulo.producto.subtitulo}</p></div>
          <Link className="btn btn-luxury" to={`/productos/${articulo.producto.id}`}>Ver en la tienda</Link>
        </div> : <aside className="maison-discover"><div><h2>Sigue explorando tus preferencias</h2><p>Compara familias, notas y concentraciones en nuestra guía.</p></div><Link className="btn btn-luxury" to="/guia-olfativa">Ver guía olfativa</Link></aside>}
        <section className="article-sources" aria-label="Fuentes del artículo"><h2>Fuentes y lectura adicional</h2><p>Las notas y características de producto se contrastaron con estas fuentes. Las propuestas de uso y comparación son orientación editorial de Maison Luxury.</p><ul>{articulo.fuentes?.map(fuente => <li key={fuente.url}><a href={fuente.url} target="_blank" rel="noopener noreferrer">{fuente.titulo}<span className="visually-hidden"> (abre en otra pestaña)</span></a></li>)}</ul><p className="small">Revisado el {new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(articulo.revisado + "T12:00:00Z"))}.</p></section>
      </article>
      <aside className="article-related"><h2>Continúa descubriendo</h2><div>{ARTICULOS.filter(item => item.id !== id).slice(0, 3).map(item => <Link key={item.id} to={`/blogs/${item.id}`}><span>{item.meta[0]}</span><h3>{item.titulo}</h3><span className="maison-text-link">Leer artículo</span></Link>)}</div></aside>
    </div>
  );
}
