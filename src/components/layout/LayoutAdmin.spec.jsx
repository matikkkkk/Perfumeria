import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import LayoutAdmin from "./LayoutAdmin";

function renderLayout(tipo = "Administrador") {
  localStorage.setItem("usuarioActual", JSON.stringify({ run: "19011022K", nombre: "Admin", apellidos: "Luxury", correo: "admin@duoc.cl", tipo }));
  return render(<MemoryRouter initialEntries={["/admin"]}><AuthProvider><Routes><Route path="/admin" element={<LayoutAdmin />}><Route index element={<h1>Panel de prueba</h1>} /></Route></Routes></AuthProvider></MemoryRouter>);
}

describe("LayoutAdmin", () => {
  it("presenta la navegación del administrador y el contenido de la ruta hija", () => {
    renderLayout();
    expect(screen.getByRole("navigation", { name: "Menú de administración" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Categorías/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Usuarios/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Panel de prueba" })).toBeInTheDocument();
  });
});
