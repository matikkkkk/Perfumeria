import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <section className="container py-5 text-center">
      <span className="section-label d-block">Error 404</span>
      <h1 className="luxury-title fst-italic mt-2">Página no encontrada</h1>
      <div className="gold-divider mx-auto my-3"></div>
      <p className="text-gold-light">La dirección que buscas no existe o fue movida.</p>
      <Link className="btn btn-luxury" to="/">Volver al inicio</Link>
    </section>
  );
}
