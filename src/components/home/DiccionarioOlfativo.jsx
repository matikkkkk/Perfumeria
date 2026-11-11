import { useId, useState } from "react";
import { TERMINOS_DICCIONARIO } from "../../data/diccionario";
import { filtrarTerminos } from "../../utils/diccionario";

// Diccionario Olfativo como sección reutilizable (en el HTML era un modal abierto desde el navbar).
// Tiene su propio estado: el texto del buscador. `terminos` permite reutilizarlo con otra lista.
export default function DiccionarioOlfativo({ terminos = TERMINOS_DICCIONARIO }) {
  const [texto, setTexto] = useState("");
  const idBuscador = useId();
  const visibles = filtrarTerminos(terminos, texto);

  return (
    <section className="py-5 diccionario-section" id="diccionario" aria-labelledby="titulo-diccionario">
      <div className="container">
        <div className="text-center mb-4">
          <span className="section-label d-block">Referencia</span>
          <h2 id="titulo-diccionario" className="luxury-title mt-2 fst-italic">
            Diccionario Olfativo
          </h2>
        </div>

        <div className="diccionario-panel mx-auto">
          <label htmlFor={idBuscador} className="visually-hidden">
            Buscar término
          </label>
          <input
            id={idBuscador}
            type="text"
            className="form-control form-luxury mb-3"
            placeholder="Buscar término..."
            autoComplete="off"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <div className="diccionario-lista">
            {visibles.map((t) => (
              <div className="diccionario-item" key={t.termino}>
                <h3 className="diccionario-termino h6">{t.termino}</h3>
                <p className="diccionario-definicion">{t.definicion}</p>
              </div>
            ))}
            {visibles.length === 0 && (
              <p className="text-center text-gold-light py-3 mb-0" role="status">
                No encontramos ese término.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
