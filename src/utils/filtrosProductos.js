import { CONCENTRACION, ESTACION, FAMILIA, HUMOR, OCASIONES, TIPO } from "./etiquetas";

// Lógica pura del catálogo (renderProductosFiltrados / ordenarProductos de script.js).
// La página guarda la selección; aquí solo se filtra, ordena y arman las opciones. Sin React ni red.

// Grupos de filtro, en el orden en que se muestran en el panel.
export const GRUPOS = ["categoria", "ocasion", "humor", "familia", "estacion", "tipo", "concentracion", "ml"];

export const ORDENES = [
  { valor: "destacados", texto: "Destacados" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
  { valor: "nombre-az", texto: "Nombre A-Z" },
];

export const crearFiltrosVacios = () => Object.fromEntries(GRUPOS.map((g) => [g, []]));

// Campo del producto que corresponde a cada grupo (la ocasión se guarda en `maridaje`).
const CAMPO_PRODUCTO = { ocasion: "maridaje" };

// Orden en que se listan las opciones de cada grupo (las claves que no estén van al final, A-Z).
const ORDEN_OPCIONES = {
  ocasion: Object.keys(OCASIONES),
  humor: Object.keys(HUMOR),
  familia: Object.keys(FAMILIA),
  estacion: Object.keys(ESTACION),
  tipo: Object.keys(TIPO),
  concentracion: Object.keys(CONCENTRACION),
};

const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Un producto puede tener un valor ("nicho") o varios (humor: ["fresco", "elegante"]); siempre se devuelve una lista de textos.
function valoresDe(producto, grupo) {
  const valor = producto[CAMPO_PRODUCTO[grupo] ?? grupo];
  if (valor === undefined || valor === null) return [];
  return (Array.isArray(valor) ? valor : [valor]).map(String);
}

// Genero y búsqueda vienen de la URL; los grupos son la selección de la página.
// Dentro de un grupo basta con coincidir con una opción (O); entre grupos deben cumplirse todos (Y).
// La búsqueda ignora mayúsculas y tildes y mira nombre + marca.
export function filtrarProductos(productos, { genero = "", buscar = "", grupos = {} } = {}) {
  const texto = normalizar(buscar);
  return productos.filter((p) => {
    if (genero && p.genero !== genero) return false;
    if (texto && !normalizar(`${p.nombre} ${p.marca ?? ""}`).includes(texto)) return false;
    return GRUPOS.every((grupo) => {
      const elegidas = grupos[grupo] ?? [];
      return elegidas.length === 0 || valoresDe(p, grupo).some((v) => elegidas.includes(v));
    });
  });
}

// Devuelve una copia ordenada; "destacados" conserva el orden de la API.
export function ordenarProductos(lista, orden) {
  const copia = [...lista];
  if (orden === "precio-asc") copia.sort((a, b) => a.precio - b.precio);
  else if (orden === "precio-desc") copia.sort((a, b) => b.precio - a.precio);
  else if (orden === "nombre-az") copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return copia;
}

// Marca u desmarca una opción sin mutar la selección anterior.
export function alternarValor(seleccion, grupo, valor) {
  const actuales = seleccion[grupo] ?? [];
  const nuevas = actuales.includes(valor) ? actuales.filter((v) => v !== valor) : [...actuales, valor];
  return { ...seleccion, [grupo]: nuevas };
}

export function hayFiltrosActivos(seleccion) {
  return GRUPOS.some((g) => (seleccion[g] ?? []).length > 0);
}

// Lee ?categoria=intensos&humor=fresco,elegante -> { categoria: ["intensos"], humor: ["fresco","elegante"], ... }
export function filtrosDesdeUrl(params) {
  const filtros = crearFiltrosVacios();
  GRUPOS.forEach((grupo) => {
    filtros[grupo] = (params.get(grupo) ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  });
  return filtros;
}

function ordenarValores(grupo, valores) {
  if (grupo === "ml") return valores.sort((a, b) => Number(a) - Number(b));
  const preferido = ORDEN_OPCIONES[grupo] ?? [];
  const posicion = (v) => (preferido.includes(v) ? preferido.indexOf(v) : preferido.length);
  return valores.sort((a, b) => posicion(a) - posicion(b) || a.localeCompare(b, "es"));
}

// Opciones que realmente existen en el catálogo, para no ofrecer filtros que siempre dan 0 resultados
// (el HTML tenía una lista fija de ML que ya no coincide con los productos).
export function opcionesDisponibles(productos) {
  return Object.fromEntries(
    GRUPOS.map((grupo) => {
      const valores = new Set(productos.flatMap((p) => valoresDe(p, grupo)));
      return [grupo, ordenarValores(grupo, [...valores])];
    })
  );
}

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

// Texto (y emoji, solo en ocasiones) con el que se muestra cada opción del panel.
export function opcionDeFiltro(grupo, valor, categorias = []) {
  switch (grupo) {
    case "categoria":
      return { valor, texto: categorias.find((c) => c.id === valor)?.nombre ?? capitalizar(valor) };
    case "ocasion": {
      const ocasion = OCASIONES[valor];
      return { valor, texto: ocasion?.label ?? valor, icono: ocasion?.icon };
    }
    case "humor":
      return { valor, texto: HUMOR[valor] ?? valor };
    case "familia":
      return { valor, texto: FAMILIA[valor] ?? valor };
    case "estacion":
      return { valor, texto: ESTACION[valor] ?? valor };
    case "tipo":
      return { valor, texto: TIPO[valor] ?? valor };
    case "concentracion":
      return { valor, texto: CONCENTRACION[valor] ?? valor };
    case "ml":
      return { valor, texto: `${valor} ML` };
    default:
      return { valor, texto: valor };
  }
}

export function textoResultado(total, buscar = "") {
  const base = `${total} ${total === 1 ? "producto encontrado" : "productos encontrados"}`;
  return buscar.trim() ? `${base} para “${buscar.trim()}”` : base;
}
