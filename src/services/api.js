// Cliente HTTP unico del frontend. Todo el acceso a la base de datos pasa por aqui:
// React -> services -> API REST (backend) -> base de datos.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} en ${opciones.method || "GET"} ${ruta}`);
  }
  // DELETE normalmente no devuelve cuerpo
  return respuesta.status === 204 ? null : respuesta.json();
}

// Crea el CRUD completo para un recurso REST (ej: "/productos").
export function crearRecurso(ruta) {
  return {
    listar: () => peticion(ruta),
    obtener: (id) => peticion(`${ruta}/${id}`),
    crear: (datos) => peticion(ruta, { method: "POST", body: JSON.stringify(datos) }),
    actualizar: (id, datos) =>
      peticion(`${ruta}/${id}`, { method: "PUT", body: JSON.stringify(datos) }),
    eliminar: (id) => peticion(`${ruta}/${id}`, { method: "DELETE" }),
  };
}
