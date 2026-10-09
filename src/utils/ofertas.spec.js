import {
  etiquetasDeOfertas,
  filtrarPorEtiqueta,
  formatearFechaCorta,
  ofertaVigente,
  ordenarOfertas,
  precioConOferta,
  productosEnOferta,
} from "./ofertas";

const HOY = new Date(2026, 9, 9); // 9 de octubre de 2026 (hora local)

const PRODUCTOS = [
  { id: "1", nombre: "Bravo", precio: 28000 },
  { id: "2", nombre: "Alfa", precio: 10000 },
  { id: "3", nombre: "Delta", precio: 50000 },
];

function oferta(cambios = {}) {
  return { id: "o1", productoId: "1", descuento: 15, etiqueta: "Verano", vigenteHasta: "2026-12-31", activa: true, ...cambios };
}

describe("precioConOferta", () => {
  it("aplica el porcentaje y redondea al peso", () => {
    expect(precioConOferta(28000, 15)).toBe(23800);
    expect(precioConOferta(9990, 12)).toBe(8791); // 8791.2
  });

  it("limita el descuento entre 0 y 100", () => {
    expect(precioConOferta(1000, -5)).toBe(1000);
    expect(precioConOferta(1000, 150)).toBe(0);
  });
});

describe("ofertaVigente", () => {
  it("está vigente si está activa y la fecha no pasó", () => {
    expect(ofertaVigente(oferta(), HOY)).toBe(true);
  });

  it("el último día todavía cuenta", () => {
    expect(ofertaVigente(oferta({ vigenteHasta: "2026-10-09" }), HOY)).toBe(true);
  });

  it("vencida o inactiva no está vigente", () => {
    expect(ofertaVigente(oferta({ vigenteHasta: "2026-10-08" }), HOY)).toBe(false);
    expect(ofertaVigente(oferta({ activa: false }), HOY)).toBe(false);
  });
});

describe("productosEnOferta", () => {
  it("cruza cada oferta vigente con su producto y calcula el precio", () => {
    const [item] = productosEnOferta([oferta()], PRODUCTOS, HOY);
    expect(item.producto.id).toBe("1");
    expect(item.precioOferta).toBe(23800);
    expect(item.ahorro).toBe(4200);
  });

  it("descarta vencidas, inactivas y las de productos que ya no existen", () => {
    const ofertas = [
      oferta({ id: "a", productoId: "1" }),
      oferta({ id: "b", productoId: "2", vigenteHasta: "2026-06-30" }),
      oferta({ id: "c", productoId: "3", activa: false }),
      oferta({ id: "d", productoId: "99" }),
    ];
    expect(productosEnOferta(ofertas, PRODUCTOS, HOY).map((i) => i.oferta.id)).toEqual(["a"]);
  });

  it("si un producto tiene dos ofertas, queda la de mayor descuento", () => {
    const ofertas = [oferta({ id: "a", descuento: 10 }), oferta({ id: "b", descuento: 25 })];
    const items = productosEnOferta(ofertas, PRODUCTOS, HOY);
    expect(items).toHaveLength(1);
    expect(items[0].oferta.id).toBe("b");
  });
});

describe("etiquetas, filtro y orden", () => {
  const items = productosEnOferta(
    [
      oferta({ id: "a", productoId: "1", descuento: 15, etiqueta: "Verano" }),
      oferta({ id: "b", productoId: "2", descuento: 30, etiqueta: "Liquidación" }),
      oferta({ id: "c", productoId: "3", descuento: 10, etiqueta: "Verano" }),
    ],
    PRODUCTOS,
    HOY
  );

  it("lista cada etiqueta una sola vez", () => {
    expect(etiquetasDeOfertas(items)).toEqual(["Verano", "Liquidación"]);
  });

  it("filtra por etiqueta y, sin etiqueta, devuelve todo", () => {
    expect(filtrarPorEtiqueta(items, "Verano")).toHaveLength(2);
    expect(filtrarPorEtiqueta(items, "")).toHaveLength(3);
  });

  it("'destacados' pone primero el mayor descuento", () => {
    expect(ordenarOfertas(items, "destacados").map((i) => i.oferta.descuento)).toEqual([30, 15, 10]);
  });

  it("ordena por precio de oferta y por nombre sin modificar la lista original", () => {
    expect(ordenarOfertas(items, "precio-asc").map((i) => i.producto.id)).toEqual(["2", "1", "3"]);
    expect(ordenarOfertas(items, "precio-desc").map((i) => i.producto.id)).toEqual(["3", "1", "2"]);
    expect(ordenarOfertas(items, "nombre-az").map((i) => i.producto.nombre)).toEqual(["Alfa", "Bravo", "Delta"]);
    expect(items.map((i) => i.oferta.id)).toEqual(["a", "b", "c"]);
  });
});

describe("formatearFechaCorta", () => {
  it("pasa AAAA-MM-DD a DD/MM/AAAA", () => {
    expect(formatearFechaCorta("2026-12-31")).toBe("31/12/2026");
  });

  it("devuelve texto vacío si la fecha falta", () => {
    expect(formatearFechaCorta(undefined)).toBe("");
  });
});
