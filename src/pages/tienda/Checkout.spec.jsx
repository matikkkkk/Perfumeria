import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConApp } from "../../test/utils";
import Checkout from "./Checkout";

const ITEM = { productoId: "1", codigo: "LUX001", nombre: "Turathi Blue", marca: "Afnan", imagen: "/img/hero-banner.jpg", precio: 28000, cantidad: 1, stock: 5, stockCritico: 1 };

describe("Checkout (eventos)", () => {
  beforeEach(() => { localStorage.setItem("carrito", JSON.stringify([ITEM])); localStorage.removeItem("cuponAplicado"); });

  it("muestra un mensaje si se intenta pagar con número de tarjeta inválido", async () => {
    const user = userEvent.setup();
    renderConApp(<Checkout />);
    await user.click(screen.getByRole("button", { name: "Confirmar y pagar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Ingresa un número de tarjeta válido");
  });
});
