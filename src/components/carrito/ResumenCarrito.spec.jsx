import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConApp } from "../../test/utils";
import ResumenCarrito from "./ResumenCarrito";

// Prueba de ESTADO (pauta: "el estado de un formulario cambia correctamente cuando el usuario introduce texto"):
// el campo del cupón, el mensaje de resultado y los montos se actualizan al escribir y aplicar.
// El carrito se siembra en localStorage, que es de donde CarritoContext lo lee.
const ITEM = {
  productoId: "1",
  codigo: "LUX001",
  nombre: "Turathi Blue",
  marca: "Afnan",
  imagen: "/img/hero-banner.jpg",
  precio: 28000,
  cantidad: 1,
  stock: 5,
  stockCritico: 1,
};

function montar({ items = [ITEM] } = {}) {
  localStorage.setItem("carrito", JSON.stringify(items));
  const onFinalizar = vi.fn();
  renderConApp(<ResumenCarrito onFinalizar={onFinalizar} />);
  return { onFinalizar, user: userEvent.setup() };
}

const total = () => screen.getByRole("heading", { level: 2 });

describe("ResumenCarrito (estado)", () => {
  it("lo que se escribe queda en el campo del cupón", async () => {
    const { user } = montar();
    const campo = screen.getByLabelText("Cupón de descuento");

    await user.type(campo, "luxury10");

    expect(campo).toHaveValue("luxury10");
  });

  it("sin cupón muestra subtotal y total iguales y ninguna línea de descuento", () => {
    montar();

    expect(total()).toHaveTextContent("$28.000");
    expect(screen.queryByText(/Descuento/)).toBeNull();
  });

  it("un cupón válido (en minúsculas) baja el total y muestra el descuento", async () => {
    const { user } = montar();

    await user.type(screen.getByLabelText("Cupón de descuento"), "luxury10");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByText("Cupón aplicado: 10% de descuento.")).toBeInTheDocument();
    expect(screen.getByText("-$2.800")).toBeInTheDocument();
    expect(total()).toHaveTextContent("$25.200");
  });

  it("un cupón inexistente avisa y no descuenta", async () => {
    const { user } = montar();

    await user.type(screen.getByLabelText("Cupón de descuento"), "NOEXISTE");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByText("Cupón no válido.")).toBeInTheDocument();
    expect(total()).toHaveTextContent("$28.000");
  });

  it("con el campo vacío pide ingresar un código", async () => {
    const { user } = montar();

    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByText("Ingresa un código de cupón.")).toBeInTheDocument();
  });

  it("'Quitar' elimina el cupón, limpia el campo y devuelve el total", async () => {
    const { user } = montar();
    await user.type(screen.getByLabelText("Cupón de descuento"), "BIENVENIDO15");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(total()).toHaveTextContent("$23.800");

    await user.click(within(screen.getByText(/Descuento/)).getByRole("button", { name: "Quitar" }));

    expect(screen.queryByText(/Descuento/)).toBeNull();
    expect(screen.getByLabelText("Cupón de descuento")).toHaveValue("");
    expect(total()).toHaveTextContent("$28.000");
  });

  it("'Finalizar compra' ejecuta onFinalizar", async () => {
    const { onFinalizar, user } = montar();

    await user.click(screen.getByRole("button", { name: "Finalizar compra" }));

    expect(onFinalizar).toHaveBeenCalledTimes(1);
  });
});
