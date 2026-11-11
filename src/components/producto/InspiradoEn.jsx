import { formatearPrecio } from "../../utils/formato";

// Franja "Inspirado en ..." de los perfumes árabes (renderInspiradoEn(producto, compacto=true) del HTML).
// No muestra nada si el producto no es árabe o no trae el dato.
export default function InspiradoEn({ producto }) {
  if (producto.tipo !== "arabe" || !producto.inspiradoEn) return null;
  const info = producto.inspiradoEn;
  return (
    <div className="inspirado-mini">
      <span className="inspirado-mini-label">
        ✦ Inspirado en <em>{info.nombre}</em>
      </span>
      <span className="inspirado-mini-precios">
        <s>{formatearPrecio(info.precioOriginal)}</s> {formatearPrecio(producto.precio)}
      </span>
    </div>
  );
}
