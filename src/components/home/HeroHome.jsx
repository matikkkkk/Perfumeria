import { Link } from "react-router-dom";
// Banner principal con accesos a las colecciones y la historia de Luxury.
export default function HeroHome() {
  return (
    <section className="hero-section">
      <img src="/img/hero-banner.jpg" alt="Maison Luxury" className="hero-banner-img" />
      <div className="hero-overlay-content text-center">
        <h1 className="display-4 luxury-title fst-italic mt-4">Descubre tu fragancia</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Perfumes árabes, de diseñador y nicho, seleccionados para cada historia.</p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <a href="#colecciones" className="btn btn-luxury">
            Explorar perfumes
          </a>
          <Link to="/nosotros" className="btn btn-luxury">Conocer Luxury</Link>
        </div>
      </div>
    </section>
  );
}
