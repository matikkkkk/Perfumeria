import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadcrumbProducto from "../../components/detalle/BreadcrumbProducto";
import ModalCompra from "../../components/detalle/ModalCompra";
import AlertaReposicion from "../../components/detalle/AlertaReposicion";
import ResenasProducto from "../../components/detalle/ResenasProducto";
import ImagenProducto from "../../components/producto/ImagenProducto";
import TarjetaProducto from "../../components/producto/TarjetaProducto";
import { DetalleProductoSkeleton } from "../../components/skeleton/LuxurySkeletons";
import { useAuth } from "../../context/AuthContext";
import { useProducto } from "../../hooks/useProducto";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { productosService } from "../../services/productosService";
import { resenasService } from "../../services/resenasService";
import { CONCENTRACION, ESTACION, TIPO, HUMOR, etiquetaFamilia, ocasionDe } from "../../utils/etiquetas";
import { formatearPrecio } from "../../utils/formato";
import "../../styles/detalle-simple.css";

const ETAPAS = [
  { clave: "salida", nombre: "Salida", descripcion: "La primera impresión" },
  { clave: "corazon", nombre: "Corazón", descripcion: "El carácter de la fragancia" },
  { clave: "fondo", nombre: "Fondo", descripcion: "La estela que permanece" },
];

function NotasOlfativas({ notas }) {
  const etapas = ETAPAS.map((etapa) => ({
    ...etapa,
    valores: Array.isArray(notas?.[etapa.clave]) ? notas[etapa.clave].filter(Boolean) : [],
  }));
  if (!etapas.some((etapa) => etapa.valores.length)) return null;
  return (
    <section className="md-detail-section" id="notas" aria-labelledby="md-notas-titulo">
      <div className="md-detail-heading">
        <span className="md-eyebrow">Composición</span>
        <h2 id="md-notas-titulo">Su pirámide olfativa</h2>
        <p>Tres momentos que revelan la personalidad de esta fragancia.</p>
      </div>
      <div className="md-notes-grid">
        {etapas.map((etapa, i) => (
          <article className="md-note" key={etapa.clave}>
            <span className="md-note-number">0{i + 1}</span>
            <div className="md-note-art" aria-hidden="true"><span className={`md-note-symbol md-note-symbol--${etapa.clave}`} /></div>
            <h3>Notas de {etapa.nombre}</h3>
            <p>{etapa.descripcion}</p>
            {etapa.valores.length ? (
              <div className="md-note-tags">{etapa.valores.map((n, j) => <span key={`${n}-${j}`}>{n}</span>)}</div>
            ) : <span className="md-note-empty">Sin notas especificadas</span>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Ocasiones({ producto }) {
  const ocasiones = (Array.isArray(producto.maridaje) ? producto.maridaje : [])
    .map(ocasionDe).filter(Boolean);
  const humores = (Array.isArray(producto.humor) ? producto.humor : [])
    .map((valor) => HUMOR[valor] || valor);
  if (!ocasiones.length && !humores.length) return null;
  return (
    <section className="md-occasions md-detail-section" aria-labelledby="md-ocasion-titulo">
      <div>
        <span className="md-eyebrow">Cómo llevarlo</span>
        <h2 id="md-ocasion-titulo">Un perfume para tus momentos</h2>
        <p>Ocasiones y sensaciones asociadas a esta fragancia.</p>
      </div>
      <div className="md-occasion-info">
        {ocasiones.length > 0 && <div className="md-occasion-group"><h3>Ideal para</h3><div className="md-inline-tags">{ocasiones.map((o, i) => <span key={`${o.label}-${i}`}>{o.label}</span>)}</div></div>}
        {humores.length > 0 && <div className="md-occasion-group"><h3>Su personalidad</h3><div className="md-inline-tags">{humores.map((h, i) => <span key={`${h}-${i}`}>{h}</span>)}</div></div>}
      </div>
    </section>
  );
}

export default function DetalleProducto() {
  const { id } = useParams();
  const { producto, cargando, error, noEncontrado, recargar } = useProducto(id);
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = useCallback(() => setModalAbierto(false), []);
  const agregarAlCarrito = useAgregarAlCarrito();
  const { usuario } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [errorResenas, setErrorResenas] = useState("");
  const [relacionados, setRelacionados] = useState([]);

  useEffect(() => {
    if (!producto?.id) return undefined;
    let vigente = true;
    setRelacionados([]);
    productosService.listar().then((datos) => {
      if (!vigente) return;
      const similitud = (p) => Number(p.tipo === producto.tipo) * 3 + Number(p.familia === producto.familia) * 2 + Number(p.genero === producto.genero);
      setRelacionados(datos.filter((p) => String(p.id) !== String(producto.id))
        .sort((a, b) => similitud(b) - similitud(a)).slice(0, 3));
    }).catch(() => { if (vigente) setRelacionados([]); });
    return () => { vigente = false; };
  }, [producto?.id, producto?.tipo, producto?.familia, producto?.genero]);

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

  if (cargando) return <div className="md-detail-page"><DetalleProductoSkeleton /></div>;
  if (noEncontrado) return <div className="md-detail-page"><div className="container py-5"><p>Producto no encontrado.</p><Link to="/productos" className="btn btn-luxury">Volver al catálogo</Link></div></div>;
  if (error || !producto) return <div className="md-detail-page"><div className="container py-5 text-center" role="alert"><p>No pudimos cargar el perfume. Comprueba la conexión con catálogo.</p><button type="button" className="btn btn-luxury" onClick={recargar}>Reintentar</button></div></div>;

  const agotado = Number(producto.stock ?? 0) <= 0;
  const atributos = [
    ["Concentración", CONCENTRACION[producto.concentracion] || producto.concentracion],
    ["Contenido", producto.ml ? `${producto.ml} ml` : null],
    ["Familia olfativa", producto.familia ? etiquetaFamilia(producto.familia) : null],
    ["Temporada", ESTACION[producto.estacion] || producto.estacion],
  ].filter(([,valor]) => valor);

  return (
    <div className="md-detail-page">
      <div className="md-detail-container">
        <BreadcrumbProducto nombre={producto.nombre} />
        <section className="md-product-top" aria-labelledby="md-product-title">
          <div className="md-product-photo">
            <ImagenProducto key={producto.imagen || producto.id} src={producto.imagen} alt={`${producto.nombre} de ${producto.marca || "Maison Luxury"}`} loading="eager" fetchPriority="high" decoding="async" />
            {producto.ml > 0 && <span className="md-photo-size">{producto.ml} ML</span>}
          </div>
          <div className="md-product-summary">
            <span className="md-eyebrow">{TIPO[producto.tipo] || "Maison Luxury"}</span>
            <p className="md-product-brand">{producto.marca}</p>
            <h1 id="md-product-title">{producto.nombre}</h1>
            {producto.descripcion && <p className="md-product-description">{producto.descripcion}</p>}
            <div className="md-product-attributes">{atributos.map(([etiqueta,valor]) => <div key={etiqueta}><span>{etiqueta}</span><strong>{valor}</strong></div>)}</div>
            <div className="md-buy-box">
              <div><span className="md-buy-label">Precio</span><strong className="md-product-price">{formatearPrecio(producto.precio)}</strong></div>
              <span className={agotado ? "md-stock md-stock--empty" : "md-stock"}>{agotado ? "Agotado" : `Disponible · ${producto.stock} uds.`}</span>
            </div>
            <div className="md-actions">
              <button type="button" className="btn btn-luxury btn-luxury--primary" disabled={agotado} onClick={() => agregarAlCarrito(producto)}>{agotado ? "Sin stock" : "Añadir al carrito"}</button>
              <button type="button" className="btn btn-outline-luxury" disabled={agotado} onClick={() => setModalAbierto(true)}>Elegir cantidad</button>
            </div>
            <p className="md-summary-footnote">Selecciona tu fragancia y continúa la compra desde el carrito.</p>
          </div>
        </section>
        <NotasOlfativas notas={producto.notas} />
        {producto.historia && <section className="md-story md-detail-section"><span className="md-eyebrow">Detrás del aroma</span><h2>{producto.historiaTitulo || "La historia de esta fragancia"}</h2><p>{producto.historia}</p></section>}
        <Ocasiones producto={producto} />
        <section className="md-reviews md-detail-section" aria-label="Opiniones de clientes"><ResenasProducto key={producto.id} productoId={producto.id} usuario={usuario} resenas={resenas} error={errorResenas} onNuevaResena={recargarResenas} /></section>
        <AlertaReposicion key={producto.id} producto={producto} usuario={usuario} />
        {relacionados.length > 0 && <section className="md-related md-detail-section" aria-labelledby="md-related-title"><div className="md-detail-heading"><span className="md-eyebrow">Explora más</span><h2 id="md-related-title">También podrían gustarte</h2></div><div className="row g-4 justify-content-center catalogo-grid">{relacionados.map((p) => <TarjetaProducto key={p.id} producto={p} columna="col-12 col-md-6 col-lg-4" />)}</div></section>}
      </div>
      <ModalCompra producto={producto} abierto={modalAbierto} onCerrar={cerrarModal} />
    </div>
  );
}
