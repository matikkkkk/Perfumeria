import { formatearPrecio } from "../../utils/formato";

// Una fila del carrito (cart-item de mostrarCarrito). No guarda estado: avisa con onCambiarCantidad(id, ±1) y onQuitar(id).
export default function ItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  const { productoId, nombre, imagen, precio, cantidad } = item;

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        <img src={imagen} alt={nombre} />
      </div>
      <div className="cart-item-info">
        <h3 className="cart-item-name">{nombre}</h3>
        <span className="cart-item-price">{formatearPrecio(precio)} c/u</span>
      </div>
      <div className="cart-item-qty">
        <button
          type="button"
          className="qty-btn"
          aria-label={`Quitar una unidad de ${nombre}`}
          onClick={() => onCambiarCantidad(productoId, -1)}
        >
          -
        </button>
        <span className="qty-value" aria-label={`Cantidad de ${nombre}`}>{cantidad}</span>
        <button
          type="button"
          className="qty-btn"
          aria-label={`Agregar una unidad de ${nombre}`}
          onClick={() => onCambiarCantidad(productoId, 1)}
        >
          +
        </button>
      </div>
      <div className="cart-item-subtotal">{formatearPrecio(precio * cantidad)}</div>
      <button type="button" className="cart-item-remove" aria-label={`Eliminar ${nombre}`} onClick={() => onQuitar(productoId)}>
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
}
