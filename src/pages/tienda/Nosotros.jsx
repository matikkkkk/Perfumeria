import { useTemporada } from "../../context/TemporadaContext";
import { Link } from "react-router-dom";
import ImagenEditorial from "../../components/ImagenEditorial";

const valores = [
  { icono: "droplet", titulo: "Elegir con intención", texto: "Explora perfumes árabes, de diseñador y de nicho. Compara sus notas y descubre qué hace especial a cada composición." },
  { icono: "flower1", titulo: "Entender lo que te gusta", texto: "Fresco, floral, amaderado o especiado: conocer una familia olfativa es el primer paso para encontrar un aroma que conecte contigo." },
  { icono: "journal-bookmark", titulo: "Disfrutar el descubrimiento", texto: "En nuestro Journal compartimos historias y consejos para que elegir y cuidar tu perfume sea parte de la experiencia." },
];
export default function Nosotros() {
  const { activo } = useTemporada();
  return <div className="maison-editorial maison-about">
    <section className="container about-intro">
      <div className="about-intro-copy"><p className="journal-signature">Nuestra esencia</p><h1>El arte de encontrar tu aroma.</h1><p className="about-lead">Hay aromas que se convierten en recuerdos. Otros, en una forma de presentarte al mundo.</p><p>Maison Luxury nace de esa conexión: una fragancia puede acompañar una emoción, una etapa y una manera muy personal de ser.</p><Link to="/productos" className="btn btn-luxury">Explorar fragancias</Link></div>
      <figure className="about-portrait"><ImagenEditorial key={String(activo)} prioridad src={activo ? "/navidad/home/nosotros.webp" : "/img/fondo-nosotros.jpg"} alt={activo ? "La selección de Maison Luxury en un ambiente navideño" : "El universo de la perfumería de Maison Luxury"} /><figcaption>Maison Luxury <span>{activo ? "El placer de regalar" : "Una elección personal"}</span></figcaption></figure>
    </section>
    <section className="about-manifesto"><div className="container"><p>Lo que nos mueve</p><h2>Un perfume se elige por cómo te hace sentir.</h2><p>Más allá del frasco, nos interesan las notas, los matices y las historias que cada fragancia puede despertar. Queremos ayudarte a descubrirlas a tu ritmo.</p></div></section>
    <section className="container about-values" aria-label="Nuestra manera de entender la perfumería">{valores.map(valor => <article key={valor.titulo}><i className={`bi bi-${valor.icono}`} aria-hidden="true" /><h2>{valor.titulo}</h2><p>{valor.texto}</p></article>)}</section>
    <section className="container"><div className="about-discovery"><ImagenEditorial src="/img/fondo-nicho.jpg" alt="Una mirada al mundo de las fragancias de nicho" /><div><h2>Tu próxima historia empieza con una nota.</h2><p>No hace falta conocer todos los perfumes para empezar. Nuestra guía te ayuda a ponerle nombre a lo que te gusta.</p><Link className="maison-text-link" to="/guia-olfativa">Descubrir mi familia olfativa <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link></div></div>
    {activo && <aside className="maison-season-note"><i className="bi bi-gift" aria-hidden="true" /><p><strong>Esta Navidad, regala algo que conecte.</strong> Piensa en sus gustos, sus momentos y los aromas que disfruta.</p><Link to="/productos">Buscar un regalo</Link></aside>}
    <aside className="maison-discover"><div><h2>Sigamos conversando de perfumes.</h2><p>Descubre el Journal o escríbenos para conocer más de Maison Luxury.</p></div><div className="about-links"><Link className="maison-text-link" to="/blogs">Leer el Journal</Link><Link className="btn btn-luxury" to="/contacto">Contactar</Link></div></aside></section>
  </div>;
}
