// Portada del producto (renderHero). Tres variantes según los datos:
//   heroFondo + heroAjuste "contain" -> imagen completa centrada
//   heroFondo                        -> imagen de fondo
//   sin heroFondo                    -> foto, nombre y descripción sobre degradado
export default function HeroProducto({ producto }) {
  const bajarAlAroma = (evento) => {
    evento.preventDefault();
    document.getElementById("piramideProducto")?.scrollIntoView?.({ behavior: "smooth" });
  };
  const botonAroma = (
    <a href="#piramideProducto" className="hero-scroll-btn" onClick={bajarAlAroma}>
      Descubrir el aroma ↓
    </a>
  );

  if (producto.heroFondo && producto.heroAjuste === "contain") {
    return (
      <div className="hero-producto hero-producto--contain">
        <h1 className="visually-hidden">{producto.nombre}</h1>
        <img src={producto.heroFondo} alt={producto.nombre} className="hero-producto--contain-img" />
        {botonAroma}
      </div>
    );
  }

  if (producto.heroFondo) {
    return (
      <div className="hero-producto hero-producto--imagen" style={{ backgroundImage: `url('${producto.heroFondo}')` }}>
        <h1 className="visually-hidden">{producto.nombre}</h1>
        {botonAroma}
      </div>
    );
  }

  return (
    <div className="hero-producto hero-producto--fallback">
      <img src={producto.imagen} alt={producto.nombre} />
      <h1 className="hero-nombre">{producto.nombre}</h1>
      <p className="hero-tagline">{producto.descripcion || ""}</p>
      {botonAroma}
    </div>
  );
}
