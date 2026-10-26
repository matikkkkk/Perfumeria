import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ordenesService } from "../../../services/ordenesService";
import PanelCliente from "../../../pages/tienda/PanelCliente";

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ usuario: { id: "12345678K", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", tipo: "Cliente" }, actualizarSesion: vi.fn() }),
}));
vi.mock("../../../services/ordenesService", () => ({
  ordenesService: { listar: vi.fn().mockResolvedValue([]), descargarBoleta: vi.fn().mockResolvedValue(undefined) },
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
  it("descarga la boleta de un pedido pagado desde Mis boletas", async () => {
    ordenesService.listar.mockResolvedValueOnce([{ id: 9, fecha: "2026-10-15T12:00:00Z", estado: "Pagado", total: 20000, items: [] }]);
    render(<MemoryRouter initialEntries={["/mi-cuenta/boletas"]}><Routes><Route path="/mi-cuenta/:seccion" element={<PanelCliente />} /></Routes></MemoryRouter>);
    fireEvent.click(await screen.findByRole("button", { name: "Descargar PDF" }));
    await waitFor(() => expect(ordenesService.descargarBoleta).toHaveBeenCalledWith(9));
  });
});
