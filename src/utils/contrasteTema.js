// Contraste relativo WCAG para superficies de color. Las fotografías se tratan en CSS
// con una superficie de lectura porque su luminosidad cambia según el encuadre.
function analizarColor(valor) {
  const color = String(valor || "").trim();
  const hex = color.match(/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((d) => d + d).join("");
    return {
      rgb: [0, 2, 4].map((n) => parseInt(h.slice(n, n + 2), 16)),
      alpha: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const rgb = color.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
  if (!rgb) return null;
  return { rgb: rgb.slice(1, 4).map((n) => Math.max(0, Math.min(255, Number(n)))), alpha: rgb[4] === undefined ? 1 : Math.max(0, Math.min(1, Number(rgb[4]))) };
}

function combinar(color, fondo) {
  if (!color) return fondo;
  return color.rgb.map((valor, i) => valor * color.alpha + fondo[i] * (1 - color.alpha));
}

function luminancia(rgb) {
  const lineal = rgb.map((v) => {
    const n = v / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return lineal[0] * 0.2126 + lineal[1] * 0.7152 + lineal[2] * 0.0722;
}

export function relacionContraste(a, b) {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function mezclar(a, b, t) {
  return a.map((n, i) => n + (b[i] - n) * t);
}

function aHex(rgb) {
  return `#${rgb.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}

function colorLegible(fondo, preferido, minimo = 4.65) {
  const blanco = [255, 250, 242];
  const negro = [24, 22, 25];
  const extremo = relacionContraste(blanco, fondo) >= relacionContraste(negro, fondo) ? blanco : negro;
  if (!preferido || relacionContraste(preferido, fondo) < minimo) {
    if (!preferido) return aHex(extremo);
    let bajo = 0;
    let alto = 1;
    for (let i = 0; i < 16; i += 1) {
      const medio = (bajo + alto) / 2;
      if (relacionContraste(mezclar(preferido, extremo, medio), fondo) >= minimo) alto = medio;
      else bajo = medio;
    }
    return aHex(mezclar(preferido, extremo, alto));
  }
  return aHex(preferido);
}

export function paletaLegible(getValor) {
  const fondoBase = combinar(analizarColor(getValor("--tema-bg")), [18, 18, 21]);
  const fondoTarjeta = combinar(analizarColor(getValor("--tema-card")), fondoBase);
  const acento = analizarColor(getValor("--tema-dorado"))?.rgb || [210, 175, 84];
  const textoOriginal = analizarColor(getValor("--tema-texto"))?.rgb;
  const secundarioOriginal = analizarColor(getValor("--tema-texto-sec"))?.rgb;
  const textoBase = colorLegible(fondoBase, textoOriginal);
  const textoTarjeta = colorLegible(fondoTarjeta, textoOriginal);
  const acentoTarjeta = colorLegible(fondoTarjeta, acento);
  const acentoRgb = analizarColor(acentoTarjeta).rgb;

  return {
    "--luxury-section-text": textoBase,
    "--luxury-section-muted": colorLegible(fondoBase, secundarioOriginal),
    "--luxury-section-accent": colorLegible(fondoBase, acento),
    "--luxury-card-surface": aHex(fondoTarjeta),
    "--luxury-card-text": textoTarjeta,
    "--luxury-card-muted": colorLegible(fondoTarjeta, secundarioOriginal),
    "--luxury-card-accent": acentoTarjeta,
    "--luxury-card-button-text": acentoTarjeta,
    "--luxury-on-accent": colorLegible(acentoRgb),
    "--luxury-modal-accent": colorLegible([22, 21, 24], acento),
  };
}
