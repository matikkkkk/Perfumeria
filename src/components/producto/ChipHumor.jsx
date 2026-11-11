import { etiquetaHumor } from "../../utils/etiquetas";

// Chip de ánimo ("Fresco", "Elegante"...). La clase mood-chip--<tag> le da el color.
export default function ChipHumor({ tag }) {
  return <span className={`mood-chip mood-chip--${tag}`}>{etiquetaHumor(tag)}</span>;
}
