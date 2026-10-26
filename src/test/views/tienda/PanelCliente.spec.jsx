import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PanelCliente from "../../../pages/tienda/PanelCliente";

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ usuario: { id: "12345678K", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", tipo: "Cliente" }, actualizarSesion: vi.fn() }),
}));
vi.mock("../../../services/ordenesService", () => ({
  ordenesService: { listar: vi.fn().mockResolvedValue([]) },
}));
vi.mock("../../../services/usuariosService", () => ({
  usuariosService: { modificar: vi.fn(), cambiarPassword: vi.fn() },
}));

describe("PanelCliente", () => {
  it("muestra el menú lateral con las secciones de la cuenta", async () => {
    render(<MemoryRouter initialEntries={["/mi-cuenta"]}><Routes><Route path="/mi-cuenta" element={<PanelCliente />} /></Routes></MemoryRouter>);
    expect(screen.getByRole("navigation", { name: "Menú de mi cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mis pedidos/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mis boletas/ })).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido, Ana/)).toBeInTheDocument();
  });
});
