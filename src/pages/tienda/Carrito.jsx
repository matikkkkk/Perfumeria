import { Link, useNavigate } from "react-router-dom";
import ItemCarrito from "../../components/carrito/ItemCarrito";
import ResumenCarrito from "../../components/carrito/ResumenCarrito";
import { useCarrito } from "../../context/CarritoContext";
import { useToast } from "../../context/ToastContext";

// Carrito (carrito.html). Los items y el cupón viven en CarritoContext; esta página solo reparte las acciones
// y avisa con toast, con los mismos textos del HTML. "Finalizar compra" lleva al checkout (antes pago.html).
export default function Carrito() {
  const { items, cambiarCantidad, quitar } = useCarrito();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();

  function cambiar(productoId, cambio) {
    const resultado = cambiarCantidad(productoId, cambio);
    if (!resultado.ok && resultado.motivo === "sin_stock") {
      const nombre = items.find((i) => i.productoId === productoId)?.nombre ?? "este producto";
      mostrarToast(`No hay más stock disponible de ${nombre}.`, "aviso");
    }
  }

  function finalizar() {
    if (items.length === 0) {
      mostrarToast("El carrito está vacío.", "aviso");
      return;
    }
    navigate("/checkout");
  }

  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <span className="text-gold text-uppercase tracking-widest fs-7">Tu selección</span>
        <h1 className="display-5 luxury-title mt-2">Carrito de compra</h1>
        <div className="gold-divider mx-auto my-3"></div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-gold-light">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-luxury">Explorar fragancias</Link>
        </div>
      ) : (
        items.map((item) => (
          <ItemCarrito key={item.productoId} item={item} onCambiarCantidad={cambiar} onQuitar={quitar} />
        ))
      )}

      <div className="row justify-content-end mt-4">
        <div className="col-12 col-md-5">
          <ResumenCarrito onFinalizar={finalizar} />
        </div>
      </div>
    </div>
  );
}
