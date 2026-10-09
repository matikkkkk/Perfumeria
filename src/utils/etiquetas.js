// Diccionarios de etiquetas: clave guardada en la BD -> texto para mostrar.
// Migrados de script.js (OCASIONES, HUMOR_LABELS, FAMILIA_LABELS, TIPO_LABELS, CONCENTRACION_LABELS).

export const OCASIONES = {
  noche_especial: { label: "Noche especial", icon: "👑" },
  dia_a_dia: { label: "Día a día", icon: "☀️" },
  trabajo_reuniones: { label: "Trabajo y reuniones", icon: "💼" },
  cita_romantica: { label: "Cita romántica", icon: "❤️" },
  playa: { label: "Verano / playa", icon: "🏖️" },
  gala: { label: "Gala", icon: "✨" },
  boda: { label: "Boda", icon: "💍" },
  evento_exclusivo: { label: "Evento exclusivo", icon: "⭐" },
};

export const HUMOR = {
  poderoso: "Poderoso",
  romantico: "Romántico",
  fresco: "Fresco",
  misterioso: "Misterioso",
  relajado: "Relajado",
  elegante: "Elegante",
};

export const FAMILIA = {
  citrico: "Cítrico",
  floral: "Floral",
  oriental: "Oriental",
  amaderado: "Amaderado",
  acuatico: "Acuático",
  gourmand: "Gourmand",
  especiado: "Especiado",
  frutal: "Frutal",
  avainillado: "Avainillado",
  atalcados: "Atalcado",
};

export const TIPO = { disenador: "Diseñador", nicho: "Nicho", arabe: "Árabe" };

export const CONCENTRACION = { edt: "EDT", edp: "EDP", parfum: "Parfum", edc: "EDC", eau_cologne: "Eau de Cologne" };

export const ESTACION = { primavera: "Primavera", verano: "Verano", otono: "Otoño", invierno: "Invierno" };

// Si la clave no existe en el diccionario se devuelve tal cual (igual que `HUMOR_LABELS[tag] || tag` del HTML).
const textoDe = (diccionario) => (clave) => diccionario[clave] || clave;

export const etiquetaHumor = textoDe(HUMOR);
export const etiquetaFamilia = textoDe(FAMILIA);
export const etiquetaTipo = textoDe(TIPO);
export const etiquetaConcentracion = textoDe(CONCENTRACION);
export const etiquetaEstacion = textoDe(ESTACION);

// Ocasión completa { label, icon }; las claves desconocidas devuelven null para poder omitirlas.
export function ocasionDe(codigo) {
  return OCASIONES[codigo] || null;
}
