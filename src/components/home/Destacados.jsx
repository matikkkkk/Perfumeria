import TarjetaProducto from "../producto/TarjetaProducto";

// "Los más buscados": grilla fija de los productos que recibe.
export default function Destacados({ productos }) {
  return (
    <section className="py-5 vh-section destacados-section">
      <div className="container">
        <div className="text-center mb-4">
          <span className="text-gold text-uppercase tracking-widest fs-7">Nuestra tienda</span>
          <h2 className="luxury-title mt-2">Los más buscados</h2>
        </div>
        <div className="row g-4 justify-content-center">
          {productos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
