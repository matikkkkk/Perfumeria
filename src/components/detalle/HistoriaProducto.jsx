const TEXTO_RESPALDO =
  "Una fragancia pensada para acompañar cada momento, elaborada con ingredientes cuidadosamente seleccionados para dejar una impresión inolvidable.";

// "Nuestra historia" (renderHistoria). El texto cae a la descripción y luego a un texto genérico.
export default function HistoriaProducto({ producto }) {
  const titulo = producto.historiaTitulo || "Nuestra Historia";
  const texto = producto.historia || producto.descripcion || TEXTO_RESPALDO;
  const conImagen = Boolean(producto.historiaImagen);

  return (
    <div
      className={`historia-producto${conImagen ? "" : " historia-producto--fallback"}`}
      style={conImagen ? { backgroundImage: `url('${producto.historiaImagen}')` } : undefined}
    >
      <div className="historia-contenido">
        <span className="text-tema-dorado text-uppercase tracking-wider fs-7">Nuestra Historia</span>
        <h3 className="titulo mt-2">{titulo}</h3>
        <p>{texto}</p>
      </div>
    </div>
  );
}
