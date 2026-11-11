import { useState } from "react";

export default function ImagenEditorial({ src, alt, prioridad = false, ...props }) {
  const [fallida, setFallida] = useState(false);
  return <img {...props} src={fallida ? "/img/fondo-nosotros.jpg" : src} alt={fallida ? "Ambiente de perfumería Maison Luxury" : alt}
    width="1200" height="900" loading={prioridad ? "eager" : "lazy"}
    fetchPriority={prioridad ? "high" : "auto"} decoding="async"
    onError={() => setFallida(true)} />;
}
