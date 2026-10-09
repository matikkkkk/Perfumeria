import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BoletaOrden from "./BoletaOrden";
import { ordenesService } from "../../services/ordenesService";

vi.mock("../../services/ordenesService", () => ({ ordenesService: { obtener: vi.fn() } }));

describe("BoletaOrden", () => {
  it("renderiza los datos del pedido y el total", async () => {
    ordenesService.obtener.mockResolvedValue({
      id: "42", fecha: "2026-09-12T15:30:00.000Z", estado: "Pagado",
      cliente: { nombre: "Camila", apellidos: "Soto", correo: "camila@test.cl" },
      envio: { calle: "Av. Perú 456", comuna: "Viña del Mar", region: "Valparaíso" },
      items: [{ productoId: "1", nombre: "Turathi Blue", precio: 28000, cantidad: 1, subtotal: 28000 }],
      subtotal: 28000, descuento: 0, total: 28000, pago: { metodo: "Tarjeta", tarjetaFinal: "4242" },
    });
    render(<MemoryRouter initialEntries={["/admin/ordenes/42"]}><Routes><Route path="/admin/ordenes/:id" element={<BoletaOrden />} /></Routes></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Boleta #42" })).toBeInTheDocument();
    expect(screen.getByText("Camila Soto")).toBeInTheDocument();
    expect(screen.getByText("Turathi Blue")).toBeInTheDocument();
    expect(screen.getAllByText("$28.000").length).toBeGreaterThanOrEqual(2);
  });
});
