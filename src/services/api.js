// Cliente HTTP unico del frontend. Todo el acceso a la base de datos pasa por aqui:
// React -> services -> API REST (backend) -> base de datos.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });

  if (!respuesta.ok) {
    // `status` permite distinguir un 404 (no existe) de una API caída sin leer el texto del mensaje.
    const error = new Error(`Error ${respuesta.status} en ${opciones.method || "GET"} ${ruta}`);
    error.status = respuesta.status;
    throw error;
  }
  // DELETE normalmente no devuelve cuerpo
  return respuesta.status === 204 ? null : respuesta.json();
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
