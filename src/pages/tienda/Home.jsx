import Destacados from "../../components/home/Destacados";
import HeroHome from "../../components/home/HeroHome";
import NuevosLanzamientos from "../../components/home/NuevosLanzamientos";
import ColeccionesLuxury from "../../components/home/ColeccionesLuxury";
import CategoriasGeneroHome from "../../components/home/CategoriasGeneroHome";
import EditorialLuxury from "../../components/home/EditorialLuxury";
import { HomeSectionSkeleton } from "../../components/skeleton/LuxurySkeletons";
import { useRecurso } from "../../hooks/useRecurso";
import { productosService } from "../../services/productosService";
import { masBuscados, ultimosLanzamientos } from "../../utils/carrusel";

export default function Home() {
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);

  return (
    <div className="luxury-home-refresh">
      <HeroHome />
      <ColeccionesLuxury />

      {cargando && (
        <>
          <HomeSectionSkeleton title="lanzamientos" cards={1} />
          <CategoriasGeneroHome />
          <HomeSectionSkeleton title="destacados" cards={4} />
          <EditorialLuxury />
        </>
      )}

      {error && (
        <div className="container py-5 text-center" role="alert">
          <p className="text-gold-light">No pudimos cargar los productos. Revisa que la API esté encendida.</p>
          <button type="button" className="btn btn-luxury" onClick={recargar}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <NuevosLanzamientos productos={ultimosLanzamientos(productos)} />
          <CategoriasGeneroHome />
          <Destacados productos={masBuscados(productos).slice(0, 4)} />
          <EditorialLuxury />
        </>
      )}
    </div>
  );
}
