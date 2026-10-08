import { productosService } from "./services/productosService";
import { useRecurso } from "./hooks/useRecurso";

export default function App() {
  const { datos: productos, cargando, error, recargar } = useRecurso(productosService);

  async function crearDePrueba() {
    await productosService.crear({ nombre: "Producto de prueba", marca: "Test", precio: 9990, stock: 5 });
    recargar();
  }

  async function eliminarUltimo() {
    const ultimo = productos[productos.length - 1];
    if (ultimo) {
      await productosService.eliminar(ultimo.id);
      recargar();
    }
  }

  if (cargando) return <p className="container py-4">Cargando...</p>;
  if (error) return <p className="container py-4 text-danger">No se pudo conectar con la API: {error}</p>;

  return (
    <div className="container py-4">
      <h1 className="h3">Paso 1: frontend conectado a la API</h1>
      <p>Productos en la base de datos: <strong>{productos.length}</strong></p>
      <button className="btn btn-dark me-2" onClick={crearDePrueba}>Crear de prueba</button>
      <button className="btn btn-outline-danger" onClick={eliminarUltimo}>Eliminar último</button>
      <ul className="mt-3">
        {productos.slice(-5).map((p) => (
          <li key={p.id}>{p.id} - {p.marca} {p.nombre} (${p.precio})</li>
        ))}
      </ul>
    </div>
  );
}
