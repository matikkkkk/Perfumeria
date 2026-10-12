import { Link } from "react-router-dom";
import ARTICULOS from "./articulosOriginales.json";

export { ARTICULOS };

export default function Blogs() {
  return (
    <main className="container py-5 my-4">
      <div className="text-center mb-5">
        <span className="text-gold text-uppercase tracking-widest small">Luxury Journal</span>
        <h1 className="display-5 luxury-title mt-2">Blogs</h1>
        <div className="gold-divider mx-auto my-3" />
      </div>
      <div className="row g-4">
        {ARTICULOS.map((articulo) => (
          <div className="col-md-6" key={articulo.id}>
            <article className="card luxury-card blog-card h-100 overflow-hidden">
              <img className="card-img-top luxury-blog-cover" src={articulo.imagen} alt={articulo.titulo} />
              <div className="card-body p-4 d-flex flex-column">
                <h2 className="h4 luxury-title">{articulo.titulo}</h2>
                <p className="text-gold-light">{articulo.id === "1" ? "Una guía sencilla para conocer el perfume que todos prefieren y les encanta." : articulo.id === "2" ? "Consejos simples para mantener una fragancia en buenas condiciones por más tiempo." : "Conoce la nueva intensidad de Yves Saint Laurent, una declaración de autoexpresión."}</p>
                <Link to={`/blogs/${articulo.id}`} className="btn btn-luxury mt-auto align-self-start">Leer más</Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
}
