import { useEffect, useState } from "react";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { formatearPrecio } from "../../utils/formato";

const MAXIMO_POR_COMPRA = 10;

// Ventana "Comprar producto" (modalCompra + llenarModalCompra). Controlada por React: la página decide cuándo está
// `abierto` y este componente avisa con onCerrar (botón, tecla Escape, clic en el fondo o tras añadir al carrito).
// Lo único propio es la cantidad elegida. Si no se puede agregar (stock), se avisa con un toast y la ventana sigue abierta.
export default function ModalCompra({ producto, abierto, onCerrar }) {
  const agregarAlCarrito = useAgregarAlCarrito();
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (abierto) setCantidad(1);
  }, [abierto, producto.id]);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTecla = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTecla);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", alTecla);
      document.body.classList.remove("modal-open");
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const agotado = producto.stock <= 0;
  const opciones = Array.from({ length: Math.min(producto.stock, MAXIMO_POR_COMPRA) }, (_, i) => i + 1);

  function anadir() {
    const resultado = agregarAlCarrito(producto, cantidad);
    if (resultado.ok) onCerrar();
  }

  return (
    <>
      <div
        className="modal fade modal-compra show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalCompraLabel"
        tabIndex={-1}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h2 className="visually-hidden" id="modalCompraLabel">Comprar producto</h2>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body text-center">
              <img src={producto.imagen} alt={producto.nombre} className="modal-compra-imagen mb-3" />
              <span className="d-block fs-7 text-uppercase tracking-wider text-gold-light">{producto.marca || ""}</span>
              <h3 className="luxury-title h4 mt-1">{producto.nombre}</h3>
              <p className="precio-modal mb-4">{formatearPrecio(producto.precio)}</p>

              <div className="text-start">
                {agotado ? (
                  <button type="button" className="btn btn-luxury w-100" disabled>
                    Sin stock
                  </button>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                      <label htmlFor="cantidadProducto" className="fs-7 text-uppercase text-gold-light mb-0">
                        Cantidad
                      </label>
                      <select
                        id="cantidadProducto"
                        className="form-select form-luxury w-auto"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                      >
                        {opciones.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <span className="fs-7 text-gold-light">Stock: {producto.stock} uds.</span>
                    </div>
                    <button type="button" className="btn btn-luxury w-100" onClick={anadir}>
                      Añadir al carrito
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
