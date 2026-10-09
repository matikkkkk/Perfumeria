import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrdenesAdmin from "./OrdenesAdmin";
import { ordenesService } from "../../services/ordenesService";

vi.mock("../../services/ordenesService", () => ({ ordenesService: { listar: vi.fn() } }));

describe("OrdenesAdmin", () => {
  it("filtra las órdenes al escribir el nombre del cliente", async () => {
    ordenesService.listar.mockResolvedValue([
      { id: 101, fecha: "2026-09-12", estado: "Pagado", total: 25000, cliente: { nombre: "Camila", apellidos: "Soto", correo: "camila@test.cl" }, items: [{ cantidad: 1 }] },
      { id: 102, fecha: "2026-09-13", estado: "Pendiente", total: 9000, cliente: { nombre: "Pedro", apellidos: "Rojas", correo: "pedro@test.cl" }, items: [{ cantidad: 1 }] },
    ]);
    render(<MemoryRouter><OrdenesAdmin /></MemoryRouter>);
    expect(await screen.findByText(/Camila Soto/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Buscar orden o cliente"), { target: { value: "Pedro" } });
    await waitFor(() => expect(screen.getByText("Pedro")).toBeInTheDocument());
    expect(screen.queryByText(/Camila Soto/)).not.toBeInTheDocument();
    expect(screen.getByText("1 de 2 órdenes")).toBeInTheDocument();
  });
});
