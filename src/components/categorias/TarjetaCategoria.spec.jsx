import { screen } from "@testing-library/react";
import { renderConApp } from "../../test/utils";
import TarjetaCategoria from "./TarjetaCategoria";

// Prueba de PROPIEDADES (pauta: "los componentes reciben y usan las propiedades adecuadas"):
// `categoria` define el texto, la imagen y el destino del enlace, y `total` el contador de fragancias.
function categoria(cambios = {}) {
  return {
    id: "intensos",
    nombre: "Intensos",
    descripcion: "Estela larga y carácter marcado.",
    imagen: "/img/fondo-coleccion-hombre.jpg",
    ...cambios,
  };
}

describe("TarjetaCategoria (props)", () => {
  it("muestra el nombre, la descripción y la imagen de la categoría recibida", () => {
    renderConApp(<TarjetaCategoria categoria={categoria()} total={5} />);

    expect(screen.getByRole("heading", { level: 3, name: "Intensos" })).toBeInTheDocument();
    expect(screen.getByText("Estela larga y carácter marcado.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Intensos" })).toHaveAttribute("src", "/img/fondo-coleccion-hombre.jpg");
  });

  it("usa el id de la categoría para armar el enlace", () => {
    renderConApp(<TarjetaCategoria categoria={categoria({ id: "ligeros", nombre: "Ligeros" })} total={2} />);

    expect(screen.getByRole("link", { name: "Ver Ligeros" })).toHaveAttribute("href", "/categorias/ligeros");
  });

  it("escribe el total en plural", () => {
    renderConApp(<TarjetaCategoria categoria={categoria()} total={14} />);
    expect(screen.getByText("14 fragancias")).toBeInTheDocument();
  });

  it("escribe el total en singular cuando hay una sola fragancia", () => {
    renderConApp(<TarjetaCategoria categoria={categoria()} total={1} />);
    expect(screen.getByText("1 fragancia")).toBeInTheDocument();
  });

  it("con total 0 lo muestra igual", () => {
    renderConApp(<TarjetaCategoria categoria={categoria()} total={0} />);
    expect(screen.getByText("0 fragancias")).toBeInTheDocument();
  });
});
