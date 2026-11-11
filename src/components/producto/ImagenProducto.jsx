import { useState } from "react";

// Imagen del perfume con respaldo para URLs vacías o imágenes que no cargan.
// La clave del componente se puede asociar al producto para reiniciar el error al cambiarlo.
export default function ImagenProducto({ src, alt = "Perfume", className = "", ...props }) {
  const [fallo, setFallo] = useState(false);
  const url = typeof src === "string" ? src.trim() : "";

  if (!url || fallo) {
    return (
      <div className={`imagen-producto-pendiente ${className}`} role="img" aria-label={`Imagen próximamente: ${alt}`}>
        <i className="bi bi-image" aria-hidden="true" />
        <span className="imagen-producto-pendiente__marca">LUXURY PERFUMERÍA</span>
        <strong>Imagen próximamente</strong>
        <small>Estamos preparando la fotografía de esta fragancia.</small>
      </div>
    );
  }

  return <img src={url} alt={alt} className={className} onError={() => setFallo(true)} {...props} />;
}
