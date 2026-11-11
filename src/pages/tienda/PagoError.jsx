import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ordenesService } from "../../services/ordenesService";
export default function PagoError() {
  const { ordenId } = useParams(); const { state } = useLocation();
  const [remota, setRemota] = useState(null);
  useEffect(() => { if (!state?.orden && ordenId) ordenesService.obtener(ordenId).then(setRemota).catch(() => {}); }, [ordenId, state?.orden]);
  const orden = state?.orden || remota;
  return <div className="container py-5"><div className="luxury-card mx-auto p-4 p-md-5 text-center" style={{maxWidth:700}}><i className="bi bi-x-circle text-danger display-1" aria-hidden="true"/><span className="d-block text-gold tracking-widest text-uppercase mt-3">Pago rechazado</span><h1 className="luxury-title display-5 mt-2">No pudimos procesar tu pago</h1><p>La orden {ordenId ? `#${ordenId}` : ""} quedó registrada con estado <strong>{orden?.estado || "Pago fallido"}</strong>, pero no se realizó ningún cobro.</p><p className="text-gold-light">Puedes volver al carrito e intentarlo nuevamente con otro medio de pago.</p><Link className="btn btn-luxury me-2" to="/carrito">Volver al carrito</Link><Link className="btn btn-outline-secondary" to="/productos">Seguir explorando</Link></div></div>;
}
