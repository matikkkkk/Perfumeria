import { useState } from "react";
import { validarCorreo } from "../utils/validaciones";

// Formulario de suscripción del footer. Mismo comportamiento y textos que el HTML.
// Por ahora no guarda nada (no hay colección de suscriptores); solo valida y agradece.
export default function NewsletterForm() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState(null); // { texto, ok }

  function enviar(evento) {
    evento.preventDefault();
    if (!validarCorreo(correo)) {
      setMensaje({ texto: "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).", ok: false });
      return;
    }
    setMensaje({ texto: "¡Gracias por suscribirte!", ok: true });
    setCorreo("");
  }

  return (
    <>
      <form className="d-flex gap-2 justify-content-center flex-wrap" onSubmit={enviar} noValidate>
        <input
          type="email"
          className="form-control form-luxury"
          style={{ maxWidth: 280 }}
          placeholder="tu@correo.com"
          aria-label="Correo para el newsletter"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <button type="submit" className="btn btn-luxury">
          Suscribirse
        </button>
      </form>
      {mensaje && (
        <small className={`d-block mt-2 ${mensaje.ok ? "text-success" : "text-danger"}`} role="status">
          {mensaje.texto}
        </small>
      )}
    </>
  );
}
