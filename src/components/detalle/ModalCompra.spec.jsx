import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConApp } from "../../test/utils";
import ModalCompra from "./ModalCompra";

// Prueba de PROPIEDADES (pauta: "los componentes reciben y usan las propiedades adecuadas"):
// `producto` define qué se muestra y cuántas unidades se pueden elegir, `abierto` decide si existe
// y `onCerrar` es la función que el componente debe ejecutar.
function producto(cambios = {}) {
  return {
    id: "1",
    codigo: "LUX001",
    nombre: "Turathi Blue",
    marca: "Afnan",
    precio: 28000,
    stock: 3,
    stockCritico: 1,
    imagen: "/img/hero-banner.jpg",
    ...cambios,
  };
}

function montar({ abierto = true, ...cambios } = {}) {
  const onCerrar = vi.fn();
  renderConApp(<ModalCompra producto={producto(cambios)} abierto={abierto} onCerrar={onCerrar} />);
  return { onCerrar, user: userEvent.setup() };
}

describe("ModalCompra (props)", () => {
  it("con abierto=false no dibuja nada", () => {
    montar({ abierto: false });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("muestra los datos del producto recibido", () => {
    montar();
    const dialogo = screen.getByRole("dialog", { name: "Comprar producto" });

    expect(within(dialogo).getByRole("heading", { level: 3, name: "Turathi Blue" })).toBeInTheDocument();
    expect(within(dialogo).getByText("Afnan")).toBeInTheDocument();
    expect(within(dialogo).getByText("$28.000")).toBeInTheDocument();
    expect(within(dialogo).getByRole("img", { name: "Turathi Blue" })).toHaveAttribute("src", "/img/hero-banner.jpg");
    expect(within(dialogo).getByText("Stock: 3 uds.")).toBeInTheDocument();
  });

  it("ofrece una cantidad por cada unidad de stock", () => {
    montar({ stock: 3 });
    expect(within(screen.getByLabelText("Cantidad")).getAllByRole("option")).toHaveLength(3);
  });

  it("con mucho stock limita la cantidad a 10", () => {
    montar({ stock: 25 });
    expect(within(screen.getByLabelText("Cantidad")).getAllByRole("option")).toHaveLength(10);
  });

  it("sin stock muestra 'Sin stock' deshabilitado y no ofrece añadir", () => {
    montar({ stock: 0 });

    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Añadir al carrito" })).toBeNull();
    expect(screen.queryByLabelText("Cantidad")).toBeNull();
  });

  it("ejecuta onCerrar con el botón Cerrar y con la tecla Escape", async () => {
    const { onCerrar, user } = montar();

    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    await user.keyboard("{Escape}");

    expect(onCerrar).toHaveBeenCalledTimes(2);
  });

  it("al añadir guarda la cantidad elegida en el carrito y ejecuta onCerrar", async () => {
    const { onCerrar, user } = montar();

    await user.selectOptions(screen.getByLabelText("Cantidad"), "2");
    await user.click(screen.getByRole("button", { name: "Añadir al carrito" }));

    const carrito = JSON.parse(localStorage.getItem("carrito"));
    expect(carrito).toHaveLength(1);
    expect(carrito[0]).toMatchObject({ productoId: "1", cantidad: 2 });
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });
});
