import { agregarItem, cambiarCantidadItem, quitarItem, cantidadTotal, subtotalItems, aItemsOrden } from "./carrito";
import { alternarId } from "./wishlist";
import { formatearPrecio } from "./formato";

const perfume = { id: "1", codigo: "LUX001", nombre: "Turathi Blue", marca: "Afnan", imagen: "a.jpg", precio: 28000, stock: 3, stockCritico: 1 };

describe("carrito (lógica pura)", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const { items, resultado } = agregarItem([], perfume);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(1);
    expect(resultado.ok).toBe(true);
    expect(resultado.critico).toBe(false); // quedan 2, crítico es 1
  });

  it("suma cantidad si el producto ya estaba y no repite la fila", () => {
    const { items } = agregarItem(agregarItem([], perfume).items, perfume, 2);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(3);
  });

  it("no deja superar el stock y no modifica el carrito", () => {
    const base = agregarItem([], perfume, 3).items;
    const { items, resultado } = agregarItem(base, perfume);
    expect(resultado.ok).toBe(false);
    expect(resultado.motivo).toBe("sin_stock");
    expect(items).toBe(base);
  });

  it("avisa stock crítico cuando quedan pocas unidades", () => {
    expect(agregarItem([], perfume, 2).resultado.critico).toBe(true); // queda 1 <= stockCritico
  });

  it("cambiarCantidad respeta el stock y elimina al llegar a 0", () => {
    const base = agregarItem([], perfume, 3).items;
    expect(cambiarCantidadItem(base, "1", 1).ok).toBe(false);
    const bajo = cambiarCantidadItem(base, "1", -1);
    expect(bajo.items[0].cantidad).toBe(2);
    const vacio = cambiarCantidadItem(agregarItem([], perfume).items, "1", -1);
    expect(vacio.items.length).toBe(0);
  });

  it("calcula unidades y subtotal, y quita productos", () => {
    const items = agregarItem(agregarItem([], perfume, 2).items, { ...perfume, id: "2", precio: 10000 }).items;
    expect(cantidadTotal(items)).toBe(3);
    expect(subtotalItems(items)).toBe(66000);
    expect(quitarItem(items, "1").length).toBe(1);
  });

  it("convierte a items de orden con subtotal y sin datos de stock", () => {
    const [item] = aItemsOrden(agregarItem([], perfume, 2).items);
    expect(item.subtotal).toBe(56000);
    expect(item.stock).toBeUndefined();
  });
});

describe("wishlist y formato", () => {
  it("alternarId agrega y quita sin mutar el arreglo original", () => {
    const original = ["1"];
    expect(alternarId(original, "2")).toEqual(["1", "2"]);
    expect(alternarId(original, "1")).toEqual([]);
    expect(original).toEqual(["1"]);
  });

  it("formatearPrecio usa punto como separador de miles", () => {
    expect(formatearPrecio(28000)).toBe("$28.000");
    expect(formatearPrecio(1234567)).toBe("$1.234.567");
    expect(formatearPrecio(0)).toBe("$0");
  });
});
