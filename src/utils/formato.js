// Formato de montos en pesos chilenos: 28000 -> "$28.000".
// Se escribe a mano (no toLocaleString) para que el resultado no cambie según el navegador ni el entorno de pruebas.
export function formatearPrecio(monto) {
  const entero = Math.round(Number(monto) || 0);
  const signo = entero < 0 ? "-" : "";
  return `${signo}$${String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
