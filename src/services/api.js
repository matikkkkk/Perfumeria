// Cliente HTTP unico del frontend. Todo el acceso a la base de datos pasa por aqui:
// React -> services -> API REST (backend) -> base de datos.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function peticion(ruta, opciones = {}) {
  const metodo = opciones.method || "GET";
  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch (causa) {
    // Sin respuesta HTTP: gateway apagado, microservicio caido o CORS mal configurado (el navegador lo reporta igual).
    const error = new Error(`No se pudo conectar con la API (${metodo} ${ruta}). Verifica que el gateway este iniciado.`);
    error.status = 0;
    error.causa = causa;
    throw error;
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
  return respuesta.status === 204 ? null : respuesta.json();
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
  return {
    listar: (consulta = "") => peticion(`${ruta}${consulta}`), // ej: listar("?categoria=intensos")
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
  const respuesta = await fetch(`${BASE_URL}${ruta}`);
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
    URL.revokeObjectURL(url);
  }
}
