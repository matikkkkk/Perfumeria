// Acceso seguro a localStorage. Si el navegador lo bloquea (modo privado, cuota llena)
// o el JSON está corrupto, la app sigue funcionando con el valor por defecto.

export function leerStorage(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch {
    return valorPorDefecto;
  }
}

// Guardar null o undefined equivale a borrar la clave.
export function guardarStorage(clave, valor) {
  try {
    if (valor === null || valor === undefined) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento disponible: se ignora */
  }
}
