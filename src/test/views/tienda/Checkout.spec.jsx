import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConApp } from "../../utils";
import Checkout from "../../../pages/tienda/Checkout";

const ITEM = { productoId: "1", codigo: "LUX001", nombre: "Turathi Blue", marca: "Afnan", imagen: "/img/hero-banner.jpg", precio: 28000, cantidad: 1, stock: 5, stockCritico: 1 };

describe("Checkout (eventos)", () => {
  beforeEach(() => { localStorage.setItem("carrito", JSON.stringify([ITEM])); localStorage.removeItem("cuponAplicado"); });

  it("muestra un mensaje si se intenta pagar con número de tarjeta inválido", async () => {
    const user = userEvent.setup();
    renderConApp(<Checkout />);
    await user.click(screen.getByRole("button", { name: "Confirmar y pagar" }));
    expect(await screen.findByText("Ingresa un número de tarjeta válido (13 a 19 dígitos).")) .toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveAttribute("aria-invalid", "true");
  });

  it("valida los datos obligatorios y muestra los mensajes bajo cada campo antes de pagar", async () => {
    const user = userEvent.setup();
    renderConApp(<Checkout />);
    await user.click(screen.getByRole("button", { name: "Confirmar y pagar" }));
    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tus apellidos.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu correo electrónico.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa la calle y el número.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una región.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una comuna.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    expect(screen.queryByText("Ingresa tu nombre.")).not.toBeInTheDocument();
  });
});
