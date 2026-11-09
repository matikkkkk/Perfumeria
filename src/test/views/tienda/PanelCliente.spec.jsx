import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import PanelCliente from "../../../pages/tienda/PanelCliente";

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    usuario: { id: 1, nombre: "Cliente", apellidos: "Prueba", correo: "cliente@ejemplo.cl", tipo: "Cliente" },
    actualizarSesion: vi.fn(),
  }),
}));
vi.mock("../../../services/ordenesService", () => ({
  ordenesService: { listar: vi.fn().mockResolvedValue([]), descargarBoleta: vi.fn() },
}));
vi.mock("../../../services/usuariosService", () => ({
  usuariosService: { modificar: vi.fn(), cambiarPassword: vi.fn() },
}));

function abrirSeccion(seccion = "") {
  const ruta = `/mi-cuenta${seccion ? `/${seccion}` : ""}`;
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes><Route path="/mi-cuenta/:seccion?" element={<PanelCliente />} /></Routes>
    </MemoryRouter>,
  );
}

describe("Panel de cliente: una prueba representativa por vista nueva", () => {
  it("Resumen: muestra la bienvenida al cliente", () => {
    abrirSeccion();
    expect(screen.getByRole("heading", { name: "Bienvenido, Cliente" })).toBeInTheDocument();
  });

});
