// Genera mock-api/db.json a partir de los datos semilla.  Uso: npm run api:seed
// ATENCION: sobrescribe db.json (borra lo creado desde la app). Usar solo para reiniciar los datos.
import { writeFileSync } from "node:fs";
import { productos } from "../seed/productos.js";
import { usuarios } from "../seed/usuarios.js";
import { categorias } from "../seed/categorias.js";
import { ofertas } from "../seed/ofertas.js";
import { ordenes } from "../seed/ordenes.js";

const db = {
  productos,
  categorias,
  ofertas,
  usuarios: usuarios.map((u) => ({ id: u.run, ...u, correo: u.correo.toLowerCase() })),
  ordenes,
  mensajes: [],
};

// Chequeos de integridad: si una semilla apunta a algo que no existe, se detiene antes de escribir.
const ids = (lista) => new Set(lista.map((x) => String(x.id)));
const errores = [];
const idsProd = ids(productos), idsCat = ids(categorias), idsUsr = ids(db.usuarios);
productos.forEach((p) => { if (!idsCat.has(p.categoria)) errores.push(`producto ${p.id}: categoria "${p.categoria}" no existe`); });
ofertas.forEach((o) => { if (!idsProd.has(o.productoId)) errores.push(`oferta ${o.id}: producto ${o.productoId} no existe`); });
ordenes.forEach((o) => {
  if (o.usuarioId && !idsUsr.has(o.usuarioId)) errores.push(`orden ${o.id}: usuario ${o.usuarioId} no existe`);
  o.items.forEach((i) => { if (!idsProd.has(i.productoId)) errores.push(`orden ${o.id}: producto ${i.productoId} no existe`); });
});
if (errores.length) { console.error("Semillas inconsistentes:\n- " + errores.join("\n- ")); process.exit(1); }

writeFileSync(new URL("./db.json", import.meta.url), JSON.stringify(db, null, 2));
console.log("db.json generado:", Object.entries(db).map(([k, v]) => `${v.length} ${k}`).join(", "));
