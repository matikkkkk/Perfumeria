import ColeccionGenero from "../../components/home/ColeccionGenero";
import Destacados from "../../components/home/Destacados";
import DiccionarioOlfativo from "../../components/home/DiccionarioOlfativo";
import HeroHome from "../../components/home/HeroHome";
import MaisonMonthly from "../../components/home/MaisonMonthly";
import Manifiesto from "../../components/home/Manifiesto";
import NuevosLanzamientos from "../../components/home/NuevosLanzamientos";
import PreguntasFrecuentes from "../../components/home/PreguntasFrecuentes";
import { useRecurso } from "../../hooks/useRecurso";
import { productosService } from "../../services/productosService";
import { masBuscados, porGenero, ultimosLanzamientos } from "../../utils/carrusel";

// Colecciones del home, en el orden del HTML. `claseFondo` trae la imagen de fondo de cada una (style.css).
const COLECCIONES = [
  { genero: "mujer", etiqueta: "Colección Mujer", titulo: "Ideal para Ellas", claseFondo: "coleccion-mujer-section", id: "colecciones" },
  { genero: "hombre", etiqueta: "Colección Hombre", titulo: "Ideal para Ellos", claseFondo: "coleccion-hombre-section", id: "coleccion-hombre" },
  { genero: "unisex", etiqueta: "Colección Unisex", titulo: "Ideal para Todos", claseFondo: "coleccion-unisex-section", id: "coleccion-unisex" },
];

// Página principal (index.html). Esta página solo pide los productos y reparte las listas;
// cada sección es un componente en components/home/.
export default function Home() {
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);

  return (
    <>
      <HeroHome />

      {cargando && (
        <p className="text-center text-gold-light py-5 mb-0" role="status">
          Cargando fragancias...
        </p>
      )}

      {error && (
        <div className="container py-5 text-center" role="alert">
          <p className="text-gold-light">No pudimos cargar los productos. Revisa que la API esté encendida.</p>
          <button type="button" className="btn btn-luxury" onClick={recargar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <NuevosLanzamientos productos={ultimosLanzamientos(productos)} />
          <Manifiesto />
          {COLECCIONES.map(({ genero, ...resto }) => (
            <ColeccionGenero key={genero} genero={genero} productos={porGenero(productos, genero)} {...resto} />
          ))}
          <MaisonMonthly />
          <Destacados productos={masBuscados(productos)} />
        </>
      )}

      <DiccionarioOlfativo />
      <PreguntasFrecuentes />
    </>
  );
}
