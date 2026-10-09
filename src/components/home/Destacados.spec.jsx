import { screen, within } from "@testing-library/react";
import { renderConApp } from "../../test/utils";
import Destacados from "./Destacados";

// Prueba de RENDERIZADO (pauta: "los componentes de lista renderizan todos los elementos de un conjunto de datos"
// y "se muestran u ocultan elementos según las condiciones").
function producto(id, cambios = {}) {
  return {
    id,
    nombre: `Perfume ${id}`,
    marca: "Maison",
    precio: 28000,
    ml: 90,
    stock: 10,
    stockCritico: 2,
    familia: "floral",
    estacion: "verano",
    tipo: "nicho",
    concentracion: "edp",
    humor: ["fresco"],
    imagen: "/img/hero-banner.jpg",
    ...cambios,
  };
}

describe("Destacados (render)", () => {
  it("muestra el título de la sección", () => {
    renderConApp(<Destacados productos={[]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Los más buscados" })).toBeInTheDocument();
  });

  it("renderiza una tarjeta por cada producto recibido", () => {
    const productos = [producto("1"), producto("2"), producto("3"), producto("4")];
    renderConApp(<Destacados productos={productos} />);

    expect(screen.getAllByRole("article")).toHaveLength(4);
    productos.forEach((p) => {
      expect(screen.getByRole("heading", { level: 3, name: p.nombre })).toBeInTheDocument();
    });
  });

  it("sin productos no dibuja ninguna tarjeta", () => {
    renderConApp(<Destacados productos={[]} />);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("cada tarjeta muestra el precio formateado, la familia y el enlace al detalle", () => {
    renderConApp(<Destacados productos={[producto("7", { precio: 34990, familia: "oriental" })]} />);
    const tarjeta = screen.getByRole("article");

    expect(within(tarjeta).getByText("$34.990")).toBeInTheDocument();
    expect(within(tarjeta).getByText(/Oriental/)).toBeInTheDocument();
    expect(within(tarjeta).getByRole("link", { name: "Descubrir" })).toHaveAttribute("href", "/productos/7");
  });

  it("el aviso '¡Últimas unidades!' aparece solo cuando el stock está en nivel crítico", () => {
    const productos = [producto("1", { stock: 2, stockCritico: 2 }), producto("2", { stock: 10 })];
    renderConApp(<Destacados productos={productos} />);

    const [critica, normal] = screen.getAllByRole("article");
    expect(within(critica).getByText("¡Últimas unidades!")).toBeInTheDocument();
    expect(within(normal).queryByText("¡Últimas unidades!")).toBeNull();
  });
});
