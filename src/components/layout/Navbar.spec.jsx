import { fireEvent, screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { renderConApp, USUARIOS_PRUEBA } from "../../test/utils";

// Navbar + un Destino que muestra la URL actual, para comprobar a dónde navega el buscador.
function Pagina() {
  const { pathname, search } = useLocation();
  return (
    <>
      <Navbar />
      <p data-testid="url">{pathname + search}</p>
    </>
  );
}

const montar = (opciones) =>
  renderConApp(
    <Routes>
      <Route path="*" element={<Pagina />} />
    </Routes>,
    opciones
  );

describe("Navbar", () => {
  it("sin sesión ofrece Ingresar y no muestra el panel admin", () => {
    montar();
    expect(screen.getByRole("link", { name: "Ingresar" })).toBeTruthy();
    expect(screen.queryByText("Panel Admin")).toBeNull();
  });

  it("los contadores de carrito y wishlist parten en 0", () => {
    montar();
    expect(screen.getByRole("link", { name: "Carrito, 0 productos" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Wishlist, 0 productos" })).toBeTruthy();
  });

  it("un Administrador con sesión ve 'Panel Admin' y 'Cerrar sesión'", () => {
    montar({ usuario: USUARIOS_PRUEBA.admin });
    expect(screen.getByText("Panel Admin")).toBeTruthy();
    expect(screen.getByText("Cerrar sesión")).toBeTruthy();
  });

  it("un Cliente con sesión no ve 'Panel Admin'", () => {
    montar({ usuario: USUARIOS_PRUEBA.cliente });
    expect(screen.queryByText("Panel Admin")).toBeNull();
    expect(screen.getByText("Cerrar sesión")).toBeTruthy();
  });

  it("el botón de menú alterna aria-expanded (evento + estado)", () => {
    montar();
    const boton = screen.getByRole("button", { name: "Abrir menú" });
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
  });

  it("buscar navega a /productos?buscar=<texto>", () => {
    montar();
    fireEvent.click(screen.getAllByRole("button", { name: "Buscar" })[0]); // abre el buscador
    fireEvent.change(screen.getByLabelText("Buscar perfumes"), { target: { value: "ámbar gris" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByTestId("url").textContent).toBe("/productos?buscar=%C3%A1mbar%20gris");
  });

  it("buscar con el campo vacío navega a /productos sin parámetros", () => {
    montar({ ruta: "/nosotros" });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByTestId("url").textContent).toBe("/productos");
  });
});
