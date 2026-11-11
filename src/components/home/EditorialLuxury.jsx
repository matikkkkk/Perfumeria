import { Link } from "react-router-dom";

export default function EditorialLuxury() {
  return (
    <section className="luxury-editorial-section" aria-label="Blog y guía olfativa">
      <div className="container">
        <div className="luxury-editorial-shell">
          <div className="luxury-editorial-feature">
            <div className="luxury-editorial-copy">
              <span className="section-label">El universo Maison Luxury</span>
              <h2 className="luxury-title fst-italic">Hay mucho más detrás de un perfume</h2>
              <p>Conoce ingredientes, familias olfativas e historias que ayudan a encontrar tu propia fragancia.</p>
            </div>
            <div className="luxury-editorial-visual" aria-hidden="true" />
          </div>
          <div className="luxury-editorial-aside">
            <Link className="luxury-editorial-mini-card" to="/blogs">
              <span className="section-label">Lecturas</span>
              <h3 className="luxury-title h4 mb-2">Blog Luxury</h3>
              <p>Historias, comparativas y recomendaciones sobre perfumes.</p>
              <span className="luxury-editorial-link-action">Explorar artículos <i className="bi bi-arrow-right" /></span>
            </Link>
            <Link className="luxury-editorial-mini-card" to="/guia-olfativa">
              <span className="section-label">Aprende a oler</span>
              <h3 className="luxury-title h4 mb-2">Guía olfativa</h3>
              <p>Familias, acordes y notas para entender lo que hueles.</p>
              <span className="luxury-editorial-link-action">Descubrir la guía <i className="bi bi-arrow-right" /></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
