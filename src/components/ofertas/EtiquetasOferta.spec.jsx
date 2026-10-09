import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EtiquetasOferta from "./EtiquetasOferta";

// Prueba de EVENTOS (pauta: "simula un clic y comprueba que se ejecute una función").
// EtiquetasOferta no guarda la selección: la recibe por props y avisa con onSeleccionar.
const ETIQUETAS = ["Verano", "Liquidación"];

function montar(props = {}) {
  const onSeleccionar = vi.fn();
  render(<EtiquetasOferta etiquetas={ETIQUETAS} seleccionada="" onSeleccionar={onSeleccionar} {...props} />);
  return { onSeleccionar, user: userEvent.setup() };
}

describe("EtiquetasOferta (eventos)", () => {
  it("muestra 'Todas' y un botón por cada etiqueta", () => {
    montar();
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["Todas", "Verano", "Liquidación"]);
  });

  it("al hacer clic en una etiqueta avisa con su nombre", async () => {
    const { onSeleccionar, user } = montar();

    await user.click(screen.getByRole("button", { name: "Liquidación" }));

    expect(onSeleccionar).toHaveBeenCalledTimes(1);
    expect(onSeleccionar).toHaveBeenCalledWith("Liquidación");
  });

  it("al hacer clic en 'Todas' avisa con texto vacío", async () => {
    const { onSeleccionar, user } = montar({ seleccionada: "Verano" });

    await user.click(screen.getByRole("button", { name: "Todas" }));

    expect(onSeleccionar).toHaveBeenCalledWith("");
  });

  it("marca como presionada solo la etiqueta seleccionada", () => {
    montar({ seleccionada: "Verano" });

    expect(screen.getByRole("button", { name: "Verano" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Liquidación" })).toHaveAttribute("aria-pressed", "false");
  });

  it("sin etiquetas no dibuja nada", () => {
    const { container } = render(<EtiquetasOferta etiquetas={[]} onSeleccionar={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
