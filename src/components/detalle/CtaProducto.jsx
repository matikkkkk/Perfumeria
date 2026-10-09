// Llamado a comprar (renderCTA). El botón solo avisa: el modal lo maneja la página.
export default function CtaProducto({ producto, onComprar }) {
  const titulo = producto.ctaTitulo || `Vive la experiencia ${producto.nombre}`;
  const texto = producto.ctaTexto || "Eleva tu presencia con una fragancia que habla por ti.";
  const conImagen = Boolean(producto.ctaFondo);

  return (
    <div
      className={`cta-producto${conImagen ? "" : " cta-producto--fallback"}`}
      style={conImagen ? { backgroundImage: `url('${producto.ctaFondo}')` } : undefined}
    >
      <div className="cta-contenido">
        <h3>{titulo}</h3>
        <p>{texto}</p>
        <button type="button" className="btn btn-outline-luxury" onClick={onComprar}>
          Comprar Ahora
        </button>
      </div>
    </div>
  );
}
