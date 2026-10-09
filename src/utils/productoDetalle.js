import { RESENAS_BANCO } from "../data/resenas";

// Lógica pura de la pantalla de detalle (temaDeProducto, resenasDeProducto, iniciales, estrellasHtml de script.js).

const TEMAS_VALIDOS = ["verano", "primavera", "invierno", "otono"];

// Si la estación no es una de las cuatro, se usa "invierno" como respaldo neutro (igual que el HTML).
export function temaDeProducto(producto) {
  const clave = String(producto?.estacion ?? "").trim().toLowerCase();
  return TEMAS_VALIDOS.includes(clave) ? clave : "invierno";
}

// El navbar se pinta oscuro sobre temas claros. El producto puede forzarlo con `navClaro`; si no, depende del tema.
export function navClaroDe(producto, tema = temaDeProducto(producto)) {
  return typeof producto.navClaro === "boolean" ? producto.navClaro : tema === "verano" || tema === "primavera";
}

// 3 reseñas, siempre las mismas para un mismo id (suma de los códigos de sus letras como punto de partida).
export function resenasDeProducto(id) {
  const suma = [...String(id)].reduce((acc, letra) => acc + letra.charCodeAt(0), 0);
  const inicio = suma % RESENAS_BANCO.length;
  return [0, 1, 2].map((paso) => RESENAS_BANCO[(inicio + paso) % RESENAS_BANCO.length]);
}

// Promedio con un decimal, como texto ("4.7"). Sin reseñas devuelve "0.0".
export function promedioResenas(resenas) {
  if (resenas.length === 0) return "0.0";
  return (resenas.reduce((suma, r) => suma + r.estrellas, 0) / resenas.length).toFixed(1);
}

export function iniciales(nombre) {
  return String(nombre)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

// 4 -> "★★★★☆"
export function estrellas(cantidad) {
  const llenas = Math.min(5, Math.max(0, Math.round(cantidad)));
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

// Estilo de fondo de una sección; sin imagen no se aplica nada.
export function estiloFondo(url) {
  if (!url) return undefined;
  return {
    backgroundImage: `url('${url}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}
