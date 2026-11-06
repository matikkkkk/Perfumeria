import { Link } from "react-router-dom";
import { useTemporada } from "../../context/TemporadaContext";

export default function HeroHome() {
  const { activo } = useTemporada();
  return (
    <section className="hero-section">
      <img src={activo ? "/navidad/home/hero.webp" : "/img/hero-banner.jpg"} alt="Interior de Maison Luxury, perfumería de lujo" className="hero-banner-img" fetchPriority="high" loading="eager" decoding="async" />
      <div className="hero-overlay-content">
        <span className="hero-eyebrow">{activo ? "PERFUMERÍA DE AUTOR · EDICIÓN NAVIDAD" : "PERFUMERÍA DE AUTOR"}</span>
        <h1 className="hero-headline">{activo ? "Regala una historia inolvidable." : "Encuentra tu esencia."}</h1>
        <p className="hero-description">{activo ? "Esta Navidad, encuentra el perfume perfecto para alguien especial." : "Fragancias árabes, de diseñador y nicho para cada historia."}</p>
        <div className="hero-actions">
          <a href="#colecciones" className="btn btn-luxury">Explorar perfumes</a>
          <Link to="/nosotros" className="btn hero-secondary-btn">Nuestra historia</Link>
        </div>
      </div>
    </section>
  );
}
