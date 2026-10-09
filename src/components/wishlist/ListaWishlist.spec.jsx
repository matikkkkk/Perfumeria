import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConApp } from "../../test/utils";
import ListaWishlist from "./ListaWishlist";

// Prueba de EVENTOS (pauta: "simula un clic y comprueba que el estado cambie"): el corazón de una tarjeta
// quita el perfume de la wishlist y la grilla se actualiza. Los ids se siembran en localStorage, de donde los lee WishlistContext.
function producto(id) {
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
  };
}
const CATALOGO = [producto("1"), producto("2"), producto("3")];

function montar(guardados) {
  localStorage.setItem("wishlist", JSON.stringify(guardados));
  renderConApp(<ListaWishlist productos={CATALOGO} />);
  return userEvent.setup();
}

describe("ListaWishlist (eventos)", () => {
  it("muestra solo los perfumes guardados", () => {
    montar(["1", "3"]);

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 3, name: "Perfume 1" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Perfume 2" })).toBeNull();
  });

  it("al hacer clic en el corazón la tarjeta sale de la lista", async () => {
    const user = montar(["1", "2"]);

    await user.click(screen.getAllByRole("button", { name: "Quitar de la wishlist" })[0]);

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByRole("heading", { name: "Perfume 1" })).toBeNull();
    expect(JSON.parse(localStorage.getItem("wishlist"))).toEqual(["2"]);
  });

  it("al quitar el último aparece el aviso de wishlist vacía con enlace al catálogo", async () => {
    const user = montar(["2"]);

    await user.click(screen.getByRole("button", { name: "Quitar de la wishlist" }));

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("Tu wishlist está vacía")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar fragancias" })).toHaveAttribute("href", "/productos");
  });

  it("sin favoritos guardados muestra directamente el aviso", () => {
    montar([]);
    expect(screen.getByText("Tu wishlist está vacía")).toBeInTheDocument();
  });
});
