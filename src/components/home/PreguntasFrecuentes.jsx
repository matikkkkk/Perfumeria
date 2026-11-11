import { useState } from "react";
import { PREGUNTAS_FRECUENTES } from "../../data/faq";

// Acordeón de preguntas: abre una a la vez (data-bs-parent del HTML). Volver a pulsar la abierta la cierra.
export default function PreguntasFrecuentes({ preguntas = PREGUNTAS_FRECUENTES }) {
  const [abierta, setAbierta] = useState(null);

  return (
    <section className="py-5 vh-half faq-section" id="preguntas-frecuentes">
      <div className="container">
        <div className="text-center mb-4">
          <span className="section-label d-block">Soporte</span>
          <h2 className="luxury-title mt-2 fst-italic">Preguntas Frecuentes</h2>
        </div>
        <div className="accordion accordion-luxury mx-auto" style={{ maxWidth: 760 }}>
          <span className="faq-gem faq-gem--tl" aria-hidden="true"></span>
          <span className="faq-gem faq-gem--tr" aria-hidden="true"></span>
          <span className="faq-gem faq-gem--bl" aria-hidden="true"></span>
          <span className="faq-gem faq-gem--br" aria-hidden="true"></span>
          {preguntas.map((item, i) => {
            const estaAbierta = abierta === i;
            return (
              <div className="accordion-item" key={item.pregunta}>
                <h3 className="accordion-header">
                  <button
                    type="button"
                    className={`accordion-button${estaAbierta ? "" : " collapsed"}`}
                    aria-expanded={estaAbierta}
                    onClick={() => setAbierta(estaAbierta ? null : i)}
                  >
                    {item.pregunta}
                  </button>
                </h3>
                <div className={`accordion-collapse collapse${estaAbierta ? " show" : ""}`}>
                  <div className="accordion-body">{item.respuesta}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
