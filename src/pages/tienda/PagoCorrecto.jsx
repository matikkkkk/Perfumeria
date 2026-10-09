import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ordenesService } from "../../services/ordenesService";
import { formatearPrecio } from "../../utils/formato";
export default function PagoCorrecto() {
  const { ordenId } = useParams(); const { state } = useLocation();
  const [remota, setRemota] = useState(null); const [cargando, setCargando] = useState(!state?.orden); const [error, setError] = useState(null);
  useEffect(() => { if (!state?.orden) ordenesService.obtener(ordenId).then(setRemota).catch(setError).finally(() => setCargando(false)); }, [ordenId, state?.orden]);
  const orden = state?.orden || remota;
  if (cargando && !orden) return <div className="container py-5 text-center">Cargando comprobante…</div>;
  if (!orden && error) return <div className="container py-5 text-center"><h1 className="luxury-title">No encontramos la orden</h1><Link to="/productos" className="btn btn-luxury">Volver a la tienda</Link></div>;
  if (!orden) return null;
  return <div className="container py-5"><div className="luxury-card mx-auto p-4 p-md-5 text-center" style={{maxWidth:760}}><i className="bi bi-check-circle text-success display-1" aria-hidden="true"/><span className="d-block text-gold tracking-widest text-uppercase mt-3">Pago confirmado</span><h1 className="luxury-title display-5 mt-2">¡Gracias por tu compra!</h1><p>Tu orden <strong>#{orden.id}</strong> fue registrada correctamente.</p><div className="text-start border rounded p-3 my-4"><div className="d-flex justify-content-between"><span>Cliente</span><strong>{orden.cliente?.nombre} {orden.cliente?.apellidos}</strong></div><div className="d-flex justify-content-between mt-2"><span>Correo</span><span>{orden.cliente?.correo}</span></div><div className="d-flex justify-content-between mt-2"><span>Estado</span><strong className="text-success">{orden.estado}</strong></div><hr/>{orden.items?.map(i=><div key={i.productoId} className="d-flex justify-content-between gap-3 mb-2"><span>{i.nombre} × {i.cantidad}</span><span>{formatearPrecio(i.subtotal)}</span></div>)}<hr/><div className="d-flex justify-content-between fw-bold fs-5 text-gold"><span>Total pagado</span><span>{formatearPrecio(orden.total)}</span></div></div><p className="text-gold-light">Enviaremos los detalles de tu compra a {orden.cliente?.correo}.</p><Link className="btn btn-luxury me-2" to="/productos">Seguir comprando</Link><button className="btn btn-outline-secondary" onClick={()=>window.print()}>Imprimir comprobante</button></div></div>;
}
