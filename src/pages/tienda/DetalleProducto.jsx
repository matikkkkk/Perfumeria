import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadcrumbProducto from "../../components/detalle/BreadcrumbProducto";
import CtaProducto from "../../components/detalle/CtaProducto";
import HeroProducto from "../../components/detalle/HeroProducto";
import HistoriaProducto from "../../components/detalle/HistoriaProducto";
import MaridajeProducto from "../../components/detalle/MaridajeProducto";
import ModalCompra from "../../components/detalle/ModalCompra";
import PiramideOlfativa from "../../components/detalle/PiramideOlfativa";
import AlertaReposicion from "../../components/detalle/AlertaReposicion";
import ResenasProducto from "../../components/detalle/ResenasProducto";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import { DetalleProductoSkeleton } from "../../components/skeleton/LuxurySkeletons";
import { useAuth } from "../../context/AuthContext";
import { useProducto } from "../../hooks/useProducto";
import { productosService } from "../../services/productosService";
import { resenasService } from "../../services/resenasService";
import { useTemaProducto } from "../../hooks/useTemaProducto";
import { estiloFondo } from "../../utils/productoDetalle";

export default function DetalleProducto() {
  const { id } = useParams();
  const { producto, cargando, error, noEncontrado, recargar } = useProducto(id);
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = useCallback(() => setModalAbierto(false), []);

  useTemaProducto(producto);
  const { usuario } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [errorResenas, setErrorResenas] = useState("");
  const [relacionados, setRelacionados] = useState([]);
  const [errorRelacionados, setErrorRelacionados] = useState(false);

  useEffect(() => {
    if (!producto?.id) return;
    let activo = true;
    setRelacionados([]);
    setErrorRelacionados(false);
    productosService.listar().then((datos) => {
      if (!activo) return;
      const similitud = (p) => Number(p.categoria === producto.categoria) * 2 + Number(p.genero === producto.genero);
      setRelacionados(
        datos
          .filter((p) => String(p.id) !== String(producto.id))
          .sort((a, b) => similitud(b) - similitud(a))
          .slice(0, 3)
      );
    }).catch(() => {
      if (activo) setErrorRelacionados(true);
    });
    return () => { activo = false; };
  }, [producto?.id, producto?.categoria, producto?.genero]);

  const recargarResenas = useCallback(async () => {
    if (!producto?.id) return;
    try {
      const datos = await resenasService.listar(`?productoId=${encodeURIComponent(producto.id)}`);
      setResenas(datos);
      setErrorResenas("");
    } catch {
      setErrorResenas("No se pudieron cargar las reseñas.");
    }
  }, [producto?.id]);

  useEffect(() => { recargarResenas(); }, [recargarResenas]);

  if (cargando) return <DetalleProductoSkeleton />;

  if (noEncontrado) {
    return (
      <div className="container py-5">
        <div className="alert alert-luxury" role="alert">Producto no encontrado.</div>
        <Link to="/productos" className="btn btn-luxury">Ver todos los productos</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center" role="alert">
        <p className="text-gold-light">No pudimos cargar el producto. Revisa que la API esté encendida.</p>
        <button type="button" className="btn btn-luxury" onClick={recargar}>Reintentar</button>
      </div>
    );
  }

  const fondo = estiloFondo(producto.fondoPagina);

  return (
    <>
      <BreadcrumbProducto nombre={producto.nombre} />
      <section id="heroProducto"><HeroProducto producto={producto} /></section>
      <section id="piramideProducto" style={fondo}><PiramideOlfativa producto={producto} /></section>
      <section id="historiaProducto" style={producto.historiaImagen ? undefined : fondo}>
        <HistoriaProducto producto={producto} />
      </section>
      <section id="reviewsProducto" style={fondo}>
        <ResenasProducto productoId={producto.id} usuario={usuario} resenas={resenas} error={errorResenas} onNuevaResena={recargarResenas} />
      </section>
      <AlertaReposicion key={producto.id} producto={producto} usuario={usuario} />
      <section id="ctaProducto"><CtaProducto producto={producto} onComprar={() => setModalAbierto(true)} /></section>
      <section id="maridajeProducto" style={fondo}><MaridajeProducto producto={producto} /></section>
      {relacionados.length > 0 && (
        <section className="detalle-relacionados py-5" style={fondo} aria-labelledby="relacionadosTitulo">
          <div className="container">
            <div className="detalle-relacionados-encabezado text-center mb-4">
              <span className="text-uppercase tracking-wider fs-7">Explora más</span>
              <h2 id="relacionadosTitulo" className="luxury-title">Fragancias que podrían gustarte</h2>
            </div>
            <div className="row g-4 justify-content-center catalogo-grid">
              {relacionados.map((p) => <TarjetaProducto key={p.id} producto={p} columna="col-12 col-sm-6 col-lg-4" />)}
            </div>
          </div>
        </section>
      )}
      {errorRelacionados && <p className="container text-gold-light text-center py-3">No se pudieron consultar otras fragancias.</p>}

      <ModalCompra producto={producto} abierto={modalAbierto} onCerrar={cerrarModal} />
    </>
  );
}
