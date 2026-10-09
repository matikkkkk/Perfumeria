const ETAPAS = [
  { clave: "salida", etiqueta: "Notas de Salida", texto: "Una apertura vibrante que despierta los sentidos." },
  { clave: "corazon", etiqueta: "Notas de Corazón", texto: "Un corazón cálido que revela su verdadero carácter." },
  { clave: "fondo", etiqueta: "Notas de Fondo", texto: "Una base envolvente que deja huella duradera." },
];

// Pirámide olfativa (renderPiramideOlfativa): una tarjeta por etapa con su imagen. Si el producto no trae
// imagen para una etapa, la tarjeta muestra el título y las notas en texto. Sin `notas` no dibuja nada.
export default function PiramideOlfativa({ producto }) {
  if (!producto.notas) return null;
  const imagenes = producto.notasImagenes ?? {};

  return (
    <div className="piramide-section" style={producto.piramideFondo ? { backgroundImage: `url('${producto.piramideFondo}')` } : undefined}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-tema-dorado text-uppercase tracking-wider fs-7">La Fragancia</span>
          <h3 className="luxury-title fst-italic mb-0">Un viaje sensorial a través de la noche</h3>
        </div>
        <div className="row g-4">
          {ETAPAS.map(({ clave, etiqueta, texto }) => {
            const notas = producto.notas[clave] ?? [];
            return (
              <div className="col-md-4" key={clave}>
                <div className={`piramide-etapa-card piramide-etapa-card--${clave}`}>
                  {imagenes[clave] ? (
                    <img
                      src={imagenes[clave]}
                      alt={notas.length ? `${etiqueta}: ${notas.join(", ")}` : etiqueta}
                      className="piramide-etapa-img"
                    />
                  ) : (
                    <>
                      <h4 className="piramide-etapa-titulo">{etiqueta}</h4>
                      <p className="piramide-etapa-notas">{notas.join(" · ")}</p>
                      <p className="piramide-etapa-texto">{texto}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
