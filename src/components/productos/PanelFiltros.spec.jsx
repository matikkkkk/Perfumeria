import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { crearFiltrosVacios } from "../../utils/filtrosProductos";
import PanelFiltros from "./PanelFiltros";

// Prueba de EVENTOS (pauta: "simula un clic y comprueba que el estado cambie o que se ejecute una función")
// con una prueba de ESTADO (el panel se abre y se cierra en pantallas chicas).
// PanelFiltros no guarda la selección: la recibe por props y avisa por onAlternar / onLimpiar.
const OPCIONES = {
  categoria: ["moderados", "intensos"],
  ocasion: ["gala", "playa"],
  humor: ["fresco", "poderoso"],
  familia: ["floral", "citrico"],
  estacion: ["verano", "otono"],
  tipo: ["nicho"],
  concentracion: ["edp"],
  ml: ["50", "100"],
};
const CATEGORIAS = [
  { id: "moderados", nombre: "Moderados" },
  { id: "intensos", nombre: "Intensos" },
];

function montar(props = {}) {
  const onAlternar = vi.fn();
  const onLimpiar = vi.fn();
  render(
    <PanelFiltros
      opciones={OPCIONES}
      seleccion={crearFiltrosVacios()}
      categorias={CATEGORIAS}
      onAlternar={onAlternar}
      onLimpiar={onLimpiar}
      {...props}
    />
  );
  return { onAlternar, onLimpiar, user: userEvent.setup() };
}

describe("PanelFiltros (eventos y estado)", () => {
  it("al marcar una opción avisa con el grupo y el valor", async () => {
    const { onAlternar, user } = montar();

    await user.click(screen.getByRole("checkbox", { name: "Poderoso" }));
    await user.click(screen.getByRole("checkbox", { name: "Intensos" }));

    expect(onAlternar).toHaveBeenCalledTimes(2);
    expect(onAlternar).toHaveBeenNthCalledWith(1, "humor", "poderoso");
    expect(onAlternar).toHaveBeenNthCalledWith(2, "categoria", "intensos");
  });

  it("las ocasiones y las capacidades se identifican por su texto, sin el emoji", async () => {
    const { onAlternar, user } = montar();

    await user.click(screen.getByRole("checkbox", { name: "Gala" }));
    await user.click(screen.getByRole("checkbox", { name: "100 ML" }));

    expect(onAlternar).toHaveBeenCalledWith("ocasion", "gala");
    expect(onAlternar).toHaveBeenCalledWith("ml", "100");
  });

  it("muestra marcadas solo las opciones de la selección recibida", () => {
    montar({ seleccion: { ...crearFiltrosVacios(), humor: ["fresco"], ml: ["50"] } });

    expect(screen.getByRole("checkbox", { name: "Fresco" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "50 ML" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Poderoso" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Verano" })).not.toBeChecked();
  });

  it("'Limpiar filtros' ejecuta onLimpiar", async () => {
    const { onLimpiar, onAlternar, user } = montar();

    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    expect(onLimpiar).toHaveBeenCalledTimes(1);
    expect(onAlternar).not.toHaveBeenCalled();
  });

  it("el botón 'Filtros' abre y cierra el panel (estado interno)", async () => {
    const { user } = montar();
    const boton = screen.getByRole("button", { name: "Filtros" });
    const panel = screen.getByRole("heading", { level: 4, name: "Filtros" }).closest(".filtros-sidebar");

    expect(boton).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toHaveClass("show");

    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveClass("show");

    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toHaveClass("show");
  });

  it("no dibuja la sección de un grupo que no tiene opciones", () => {
    montar({ opciones: { ...OPCIONES, categoria: [] } });

    expect(screen.queryByRole("heading", { name: "Categoría" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Ocasión" })).toBeInTheDocument();
  });
});
