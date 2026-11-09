import { useCallback, useEffect, useState } from "react";
import { ordenesService } from "../services/ordenesService";

export default function BoletaAcciones({ ordenId }) {
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const consultar = useCallback(async () => {
    const respuesta = await ordenesService.estadoCorreo(ordenId);
    if (!respuesta || typeof respuesta.estado !== "string") throw new Error("Respuesta inválida");
    return respuesta;
  }, [ordenId]);
  useEffect(() => {
    let vigente = true;
    let timer;
    let consultas = 0;
    async function actualizar() {
      try {
        const resultado = await consultar();
        if (!vigente) return;
        setEstado(resultado); setError("");
        if (["PENDIENTE", "ENVIANDO"].includes(resultado.estado) && ++consultas < 36) timer = setTimeout(actualizar, 5000);
      } catch { if (vigente) setError("No pudimos consultar el envío. Puedes descargar tu PDF o volver a consultar."); }
    }
    actualizar();
    return () => { vigente = false; clearTimeout(timer); };
  }, [consultar, revision]);

  async function descargar() {
    setOcupado(true); setError("");
    try { await ordenesService.descargarBoleta(ordenId); }
    catch { setError("No pudimos descargar el PDF. Revisa la conexión y vuelve a intentarlo."); }
    finally { setOcupado(false); }
  }
  async function solicitar() {
    setOcupado(true); setError("");
    try { setEstado(await ordenesService.solicitarCorreo(ordenId)); setRevision(r => r + 1); }
    catch { setError("No pudimos solicitar el envío. Vuelve a intentarlo en unos momentos."); }
    finally { setOcupado(false); }
  }
  return <section className="boleta-acciones no-print" aria-label="Comprobante de compra">
    <div role="status" aria-live="polite"><p>{estado?.mensaje || (error ? "Estado del envío no disponible." : "Consultando el envío de tu comprobante…")}</p>{estado?.destinatario && <p className="small">Correo de la compra: <strong>{estado.destinatario}</strong></p>}</div>
    {error && <p role="alert" className="text-danger">{error}</p>}
    <div className="d-flex flex-wrap gap-2 justify-content-center">
      <button type="button" className="btn btn-luxury" disabled={ocupado} onClick={descargar}><i className="bi bi-file-earmark-pdf me-2" aria-hidden="true" />Descargar boleta PDF</button>
      {estado && ["ERROR", "DESACTIVADO", "SIN_SOLICITAR"].includes(estado.estado) && <button type="button" className="btn btn-outline-secondary" disabled={ocupado} onClick={solicitar}>Solicitar envío por correo</button>}
      {error && <button type="button" className="btn btn-outline-secondary" onClick={() => setRevision(r => r + 1)}>Actualizar estado</button>}
    </div>
  </section>;
}
