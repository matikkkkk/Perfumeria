import { useState } from "react";
import { useCarrito } from "../../context/CarritoContext";
import { formatearPrecio } from "../../utils/formato";

// Tarjeta "Resumen" del carrito: cupón, subtotal, descuento, total y botón de finalizar.
// Montos y cupón vienen de CarritoContext (se guardan en localStorage, igual que el HTML).
// Lo propio de este componente es lo que se escribe en el campo del cupón y el mensaje de resultado.
export default function ResumenCarrito({ onFinalizar }) {
  const { subtotal, descuento, total, cupon, aplicarCupon, quitarCupon } = useCarrito();
  const [codigo, setCodigo] = useState(cupon ?? "");
  const [mensaje, setMensaje] = useState(null); // { ok, texto }

  function aplicar() {
    const resultado = aplicarCupon(codigo);
    setMensaje({ ok: resultado.ok, texto: resultado.mensaje });
  }

  function quitar() {
    quitarCupon();
    setCodigo("");
    setMensaje(null);
  }

  return (
    <div className="luxury-card p-4 text-center">
      <h3 className="luxury-title">Resumen</h3>

      <div className="mb-3 text-start">
        <label htmlFor="cuponInput" className="fs-7 text-uppercase text-gold-light mb-1 d-block">
          Cupón de descuento
        </label>
        <div className="input-group">
          <input
            type="text"
            id="cuponInput"
            className="form-control form-luxury"
            placeholder="Ej: LUXURY10"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button type="button" className="btn btn-outline-luxury" onClick={aplicar}>
            Aplicar
          </button>
        </div>
        {mensaje && (
          <small className={`d-block mt-1 ${mensaje.ok ? "text-success" : "text-danger"}`} role="status">
            {mensaje.texto}
          </small>
        )}
      </div>

      <p className="d-flex justify-content-between mb-1">
        <span>Subtotal</span>
        <span>{formatearPrecio(subtotal)}</span>
      </p>
      {descuento > 0 && (
        <p className="d-flex justify-content-between align-items-center mb-1 text-gold">
          <span>
            Descuento ({cupon}){" "}
            <button type="button" className="btn btn-link btn-sm p-0 text-gold-light align-baseline" onClick={quitar}>
              Quitar
            </button>
          </span>
          <span>{`-${formatearPrecio(descuento)}`}</span>
        </p>
      )}
      <h2 className="price my-3">{formatearPrecio(total)}</h2>

      <button type="button" className="btn btn-luxury w-100" onClick={onFinalizar}>
        Finalizar compra
      </button>
    </div>
  );
}
