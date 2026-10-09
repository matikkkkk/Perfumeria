import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardAdmin from "./DashboardAdmin";
import { ordenesService } from "../../services/ordenesService";
import { productosService } from "../../services/productosService";
import { usuariosService } from "../../services/usuariosService";

vi.mock("../../services/ordenesService", () => ({ ordenesService: { listar: vi.fn() } }));
vi.mock("../../services/productosService", () => ({ productosService: { listar: vi.fn() } }));
vi.mock("../../services/usuariosService", () => ({ usuariosService: { listar: vi.fn() } }));

describe("DashboardAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ordenesService.listar.mockResolvedValue([{ id: 7, fecha: "2026-09-12", estado: "Pagado", total: 45000, cliente: { nombre: "Ana", apellidos: "Pérez" }, items: [] }]);
    productosService.listar.mockResolvedValue([{ id: "p1", nombre: "Perfume", marca: "Luxury", stock: 1, stockCritico: 2 }]);
    usuariosService.listar.mockResolvedValue([{ id: "u1" }, { id: "u2" }]);
  });
  it("muestra las métricas y la orden reciente cuando llegan los datos", async () => {
    render(<MemoryRouter><DashboardAdmin /></MemoryRouter>);
    expect((await screen.findAllByText("$45.000")).length).toBeGreaterThan(0);
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("1 con stock crítico")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
