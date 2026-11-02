import { Link } from "react-router-dom";

export default function HeroHome() {
  return (
    <section className="hero-section">
      <img src="/img/hero-banner.jpg" alt="Interior de Maison Luxury, perfumería de lujo" className="hero-banner-img" />
      <div className="hero-overlay-content">
        <span className="hero-eyebrow">PERFUMERÍA DE AUTOR</span>
        <h1 className="hero-headline">Encuentra tu esencia.</h1>
        <p className="hero-description">Fragancias árabes, de diseñador y nicho para cada historia.</p>
        <div className="hero-actions">
          <a href="#colecciones" className="btn btn-luxury">Explorar perfumes</a>
          <Link to="/nosotros" className="btn hero-secondary-btn">Nuestra historia</Link>
        </div>
      </div>
    </section>
  );
}
