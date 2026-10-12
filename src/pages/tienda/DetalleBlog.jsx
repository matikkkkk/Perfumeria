import { Link, useParams } from "react-router-dom";
import { ARTICULOS } from "./Blogs";

export default function DetalleBlog() {
  const { id } = useParams();
  const articulo = ARTICULOS.find((item) => item.id === id);
  if (!articulo) return <main className="container py-5 text-center"><h1>Artículo no encontrado</h1><Link to="/blogs" className="btn btn-luxury">Volver a Blogs</Link></main>;

  return (
    <main className="container py-5 my-4">
      <article className="luxury-card p-4 p-md-5 luxury-blog-detail">
        <Link to="/blogs" className="text-gold-light d-inline-block mb-3"><i className="bi bi-arrow-left me-2" />Volver a Blogs</Link>
        <h1 className="luxury-title fst-italic blog-title">{articulo.titulo}</h1>
        <div className="blog-meta">
          {articulo.meta.map((dato, i) => <span key={dato}><i className={`bi bi-${i === 0 ? "clock" : i === 1 ? "droplet" : "person"}`} />{dato}</span>)}
        </div>
        <div className="blog-hero-frame"><img src={articulo.imagen} alt={articulo.titulo} /><span className="blog-hero-badge">{articulo.badge}</span></div>
        {articulo.blocks.map((bloque, i) => {
          if (bloque.type === "heading") return <h2 className="blog-subhead" key={i}>{bloque.text}</h2>;
          if (bloque.type === "notes") return <div className="notes-block" key={i}>{bloque.groups.map((grupo) => <div className="notes-row" key={grupo.label}><span className="note-pill-label w-100">{grupo.label}</span>{grupo.notes.map((nota) => <span className="note-pill" key={nota}>{nota}</span>)}</div>)}</div>;
          return <p key={i} className={bloque.type === "lead" ? "blog-lead" : "luxury-blog-paragraph"}>{bloque.text}</p>;
        })}
        <div className="blog-cta-card">
          <img src={articulo.producto.imagen} alt={articulo.producto.titulo} className="blog-cta-img" />
          <div className="blog-cta-text"><span className="cta-eyebrow">Disponible en LUXURY</span><h5>{articulo.producto.titulo}</h5><p>{articulo.producto.subtitulo}</p></div>
          <Link className="btn btn-luxury" to={`/productos/${articulo.producto.id}`}>Ver en la tienda</Link>
        </div>
      </article>
    </main>
  );
}
