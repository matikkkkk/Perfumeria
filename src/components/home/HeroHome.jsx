// Banner principal. "Diccionario Olfativo" lleva a la sección del mismo nombre más abajo en el home
// (en el HTML abría un modal; ahora es una sección, ver DiccionarioOlfativo).
export default function HeroHome() {
  return (
    <section className="hero-section">
      <img src="/img/hero-banner.jpg" alt="Maison Luxury" className="hero-banner-img" />
      <div className="hero-overlay-content text-center">
        <h1 className="display-4 luxury-title fst-italic mt-4">Descubre tu fragancia</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Curaduría de fragancias para cada estación del año</p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <a href="#colecciones" className="btn btn-luxury">
            Explorar
          </a>
          <a href="#diccionario" className="btn btn-luxury">
            <i className="bi bi-stars"></i> Diccionario Olfativo
          </a>
        </div>
      </div>
    </section>
  );
}
