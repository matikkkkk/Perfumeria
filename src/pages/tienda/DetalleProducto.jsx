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
import { useProducto } from "../../hooks/useProducto";
import { useTemaProducto } from "../../hooks/useTemaProducto";
import { estiloFondo } from "../../utils/productoDetalle";
import { resenasService } from "../../services/resenasService";
import { useAuth } from "../../context/AuthContext";

// Detalle (producto.html). La página carga el producto, aplica su tema al <body> y reparte los datos a una sección por
// componente, en el orden del HTML: hero, pirámide, historia, reseñas, llamado a comprar y maridaje.
// El producto viene de GET /productos/:id; la ventana de compra es estado de esta página.
export default function DetalleProducto() {
  const { id } = useParams();
  const { producto, cargando, error, noEncontrado, recargar } = useProducto(id);
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = useCallback(() => setModalAbierto(false), []);

  useTemaProducto(producto);
  const { usuario } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [errorResenas, setErrorResenas] = useState("");
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

  if (cargando) {
    return (
      <p className="text-center text-gold-light py-5 mb-0" role="status">
        Cargando fragancia...
      </p>
    );
  }

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

  // La imagen de fondo general va en pirámide, reseñas y maridaje; en la historia solo si no trae la suya.
  const fondo = estiloFondo(producto.fondoPagina);

  return (
    <>
      <BreadcrumbProducto nombre={producto.nombre} />
      <section id="heroProducto"><HeroProducto producto={producto} /></section>
      <section id="piramideProducto" style={fondo}><PiramideOlfativa producto={producto} /></section>
      <section id="historiaProducto" style={producto.historiaImagen ? undefined : fondo}>
        <HistoriaProducto producto={producto} />
      </section>
      <section id="reviewsProducto" style={fondo}><ResenasProducto productoId={producto.id} usuario={usuario} resenas={resenas} error={errorResenas} onNuevaResena={recargarResenas} /></section>
      <AlertaReposicion key={producto.id} producto={producto} usuario={usuario} />
      <section id="ctaProducto"><CtaProducto producto={producto} onComprar={() => setModalAbierto(true)} /></section>
      <section id="maridajeProducto" style={fondo}><MaridajeProducto producto={producto} /></section>

      <ModalCompra producto={producto} abierto={modalAbierto} onCerrar={cerrarModal} />
    </>
  );
}
