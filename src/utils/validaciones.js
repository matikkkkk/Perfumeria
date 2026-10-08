// Validaciones migradas de script.js (validarCorreo, validarRun, reglasCampos).
// Son funciones puras: no tocan el DOM, así se prueban sin renderizar nada.

// Quita puntos y guion y pasa a mayúsculas: "19.011.022-k" -> "19011022K".
// Es el formato en que se guarda el RUN (también es el id del usuario en la BD).
export function limpiarRun(run) {
  return String(run ?? "").toUpperCase().replace(/\./g, "").replace(/-/g, "");
}

export function validarCorreo(correo) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(String(correo ?? "").trim());
}

// Módulo 11 chileno.
export function calcularDigitoVerificador(cuerpoRun) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpoRun.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpoRun.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export function validarRun(run) {
  const limpio = limpiarRun(run);
  if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) return false;
  return calcularDigitoVerificador(limpio.slice(0, -1)) === limpio.slice(-1);
}

// Reglas por campo: devuelven "" si el valor es válido o el mensaje de error.
// Reciben (valor, valores) donde `valores` es el objeto con todos los campos del formulario
// (el HTML recibía el <form>; en React el formulario vive en el estado).
export const reglasCampos = {
  run: (valor) => {
    if (!valor) return "El RUN es obligatorio.";
    if (!validarRun(valor)) return "RUN inválido. Verifica el dígito verificador (sin puntos ni guion, ej: 190110222).";
    return "";
  },
  nombre: (valor) => {
    if (!valor) return "El nombre es obligatorio.";
    if (valor.length > 50) return "Máximo 50 caracteres.";
    return "";
  },
  apellidos: (valor) => {
    if (!valor) return "Los apellidos son obligatorios.";
    if (valor.length > 100) return "Máximo 100 caracteres.";
    return "";
  },
  correo: (valor) => {
    if (!valor) return "El correo es obligatorio.";
    if (valor.length > 100) return "Máximo 100 caracteres.";
    if (!validarCorreo(valor)) return "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    return "";
  },
  password: (valor) => {
    if (valor.length < 4 || valor.length > 10) return "Entre 4 y 10 caracteres.";
    return "";
  },
  passwordConfirm: (valor, valores = {}) => {
    if (valor !== valores.password) return "Las contraseñas no coinciden.";
    return "";
  },
  direccion: (valor) => {
    if (!valor) return "La dirección es obligatoria.";
    if (valor.length > 300) return "Máximo 300 caracteres.";
    return "";
  },
  region: (valor) => (valor ? "" : "Selecciona una región."),
  comuna: (valor) => (valor ? "" : "Selecciona una comuna."),
  numeroTarjeta: (valor) => {
    const limpio = valor.replace(/\s+/g, "");
    if (!limpio) return "El número de tarjeta es obligatorio.";
    if (!/^[0-9]{13,19}$/.test(limpio)) return "Ingresa un número de tarjeta válido.";
    return "";
  },
  nombreTarjeta: (valor) => {
    if (!valor) return "El nombre en la tarjeta es obligatorio.";
    if (valor.length > 100) return "Máximo 100 caracteres.";
    return "";
  },
  vencimiento: (valor) => {
    if (!valor) return "La fecha de vencimiento es obligatoria.";
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(valor)) return "Formato inválido. Usa MM/AA.";
    return "";
  },
  cvv: (valor) => {
    if (!valor) return "El CVV es obligatorio.";
    if (!/^[0-9]{3,4}$/.test(valor)) return "El CVV debe tener 3 o 4 dígitos.";
    return "";
  },
};

// Valida un objeto completo { campo: valor } y devuelve { campo: mensaje } solo con los que fallan.
// Campos sin regla se ignoran. Objeto vacío = formulario válido.
export function validarFormulario(valores, campos = Object.keys(valores)) {
  const errores = {};
  campos.forEach((campo) => {
    const regla = reglasCampos[campo];
    if (!regla) return;
    const mensaje = regla(String(valores[campo] ?? ""), valores);
    if (mensaje) errores[campo] = mensaje;
  });
  return errores;
}
