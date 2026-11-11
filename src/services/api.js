// Cliente HTTP unico del frontend. Todo el acceso a la base de datos pasa por aqui:
// React -> services -> API REST (backend) -> base de datos.

import { leerStorage } from "../utils/storage";

const configurada = (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1").replace(/\/$/, "");
const BASE_URL = configurada.endsWith("/api") ? configurada + "/v1" : configurada;

function autorizacion(ruta) {
  if (ruta.startsWith("/auth/")) return {};
  const orden = ruta.match(/^\/ordenes\/(\d+)(?:\/|$)/);
  const token = (orden && sessionStorage.getItem("boleta:" + orden[1])) || leerStorage("usuarioActual", null)?.accessToken;
  return token ? { Authorization: "Bearer " + token } : {};
}

export async function peticion(ruta, opciones = {}) {
  const metodo = opciones.method || "GET";
  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      ...opciones,
      headers: { "Content-Type": "application/json", ...autorizacion(ruta), ...opciones.headers },
    });
  } catch (causa) {
    // Sin respuesta HTTP: gateway apagado, microservicio caido o CORS mal configurado (el navegador lo reporta igual).
    const error = new Error(`No se pudo conectar con la API (${metodo} ${ruta}). Verifica que el gateway este iniciado.`);
    error.status = 0;
    error.causa = causa;
    throw error;
  }

  if (respuesta.status === 401 && !ruta.startsWith("/auth/") && leerStorage("usuarioActual", null)) {
    window.dispatchEvent(new Event("maison-sesion-vencida"));
  }
  if (!respuesta.ok) {
    // `status` permite distinguir un 404 (no existe) de una API caída sin leer el texto del mensaje.
    const error = new Error(`Error ${respuesta.status} en ${metodo} ${ruta}`);
    error.status = respuesta.status;
    // El backend responde { status, error, mensaje, campo? }. `campo` lo usa el login (401).
    error.cuerpo = await leerCuerpoDeError(respuesta);
    throw error;
  }
  // DELETE normalmente no devuelve cuerpo
  const datos = respuesta.status === 204 ? null : await respuesta.json();
  if (ruta === "/ordenes" && metodo === "POST" && datos?.id) {
    const permiso = respuesta.headers?.get("X-Boleta-Token");
    if (permiso) sessionStorage.setItem("boleta:" + datos.id, permiso);
  }
  return datos;
}

async function leerCuerpoDeError(respuesta) {
  try {
    return await respuesta.json();
  } catch {
    return null; // cuerpo vacio o no es JSON (ej. 502 del gateway)
  }
}

// Crea el CRUD completo para un recurso REST (ej: "/productos").
export function crearRecurso(ruta) {
  const listasEnCurso = new Map();
  const listar = (consulta = "") => {
    if (listasEnCurso.has(consulta)) return listasEnCurso.get(consulta);
    const solicitud = peticion(`${ruta}${consulta}`).finally(() => listasEnCurso.delete(consulta));
    listasEnCurso.set(consulta, solicitud);
    return solicitud;
  };
  return {
    listar, // ej: listar("?categoria=intensos")
    obtener: (id) => peticion(`${ruta}/${id}`),
    crear: (datos) => peticion(ruta, { method: "POST", body: JSON.stringify(datos) }),
    actualizar: (id, datos) =>
      peticion(`${ruta}/${id}`, { method: "PUT", body: JSON.stringify(datos) }), // reemplaza el objeto completo
    modificar: (id, cambios) =>
      peticion(`${ruta}/${id}`, { method: "PATCH", body: JSON.stringify(cambios) }), // solo los campos enviados
    eliminar: (id) => peticion(`${ruta}/${id}`, { method: "DELETE" }),
  };
}

// Respuestas binarias: las boletas PDF no se pueden leer con respuesta.json().
export async function descargarPdf(ruta, nombreArchivo) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, { headers: autorizacion(ruta) });
  if (!respuesta.ok) {
    throw new Error(`No se pudo descargar la boleta (HTTP ${respuesta.status}).`);
  }
  const blob = await respuesta.blob();
  const url = URL.createObjectURL(blob);
  try {
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  } finally {
    // Dar tiempo al navegador para iniciar la descarga antes de liberar el blob.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
