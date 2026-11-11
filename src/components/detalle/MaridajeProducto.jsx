import { ocasionDe } from "../../utils/etiquetas";
import ChipHumor from "../producto/ChipHumor";

// "Ideal para" (renderMaridaje): ocasiones y estados de ánimo. Las ocasiones desconocidas se omiten;
// si no queda nada que mostrar, no dibuja la sección.
export default function MaridajeProducto({ producto }) {
  const ocasiones = (producto.maridaje ?? []).map((codigo) => ({ codigo, ocasion: ocasionDe(codigo) })).filter((o) => o.ocasion);
  const humores = producto.humor ?? [];
  if (ocasiones.length === 0 && humores.length === 0) return null;

  return (
    <div className="maridaje-section">
      <div className="maridaje-contenido">
        <span className="text-tema-dorado text-uppercase tracking-wider fs-7">Maridaje</span>
        <h3 className="luxury-title fst-italic mb-4">Ideal Para</h3>
        {ocasiones.length > 0 && (
          <div className="occasion-chip-list mb-3 justify-content-center">
            {ocasiones.map(({ codigo, ocasion }) => (
              <span className="occasion-chip" key={codigo}>
                <span aria-hidden="true">{ocasion.icon}</span> {ocasion.label}
              </span>
            ))}
          </div>
        )}
        {humores.length > 0 && (
          <div className="mood-chip-list justify-content-center">
            {humores.map((tag) => (
              <ChipHumor key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
