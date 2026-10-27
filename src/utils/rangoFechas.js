// Comparación por día de calendario local; límites inclusivos (BETWEEN).
export function fechaLocal(fecha) {
  if (!fecha) return "";
  const texto = String(fecha);
  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10);
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "";
  const n = (x) => String(x).padStart(2, "0");
  return `${valor.getFullYear()}-${n(valor.getMonth() + 1)}-${n(valor.getDate())}`;
}
export function filtrarPorFechas(ordenes = [], desde = "", hasta = "") {
  if (desde && hasta && desde > hasta) return [];
  return ordenes.filter((orden) => {
    if (!desde && !hasta) return true;
    const fecha = fechaLocal(orden.fecha);
    return !!fecha && (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
  });
}
