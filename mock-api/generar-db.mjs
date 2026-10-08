// Genera mock-api/db.json a partir de los datos semilla.
import { writeFileSync } from "node:fs";
import { productos } from "../seed/productos.js";
import { usuarios } from "../seed/usuarios.js";

const db = {
  productos,
  usuarios: usuarios.map((u) => ({ id: u.run, ...u })),
  ordenes: [],
  mensajes: [],
};
writeFileSync(new URL("./db.json", import.meta.url), JSON.stringify(db, null, 2));
console.log("db.json generado:", productos.length, "productos");
