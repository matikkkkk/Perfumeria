// Formateo y validación para el pago SIMULADO. No se procesa ningún cobro real.
export function formatearTarjeta(valor) {
  return valor.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}
export function formatearVencimiento(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}
export function vencimientoValido(valor, ahora = new Date()) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(valor)) return false;
  const [mes, anio] = valor.split("/").map(Number);
  const anioActual = ahora.getFullYear() % 100;
  const mesActual = ahora.getMonth() + 1;
  return anio > anioActual || (anio === anioActual && mes >= mesActual);
}
