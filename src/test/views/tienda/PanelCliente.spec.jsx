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

  it("Mis pedidos: muestra la sección de historial", () => {
    abrirSeccion("pedidos");
    expect(screen.getByRole("heading", { name: "Mis pedidos" })).toBeInTheDocument();
  });

  it("Mis boletas: muestra la sección de comprobantes", () => {
    abrirSeccion("boletas");
    expect(screen.getByRole("heading", { name: "Mis boletas" })).toBeInTheDocument();
  });

  it("Mi perfil: muestra el formulario de datos personales", () => {
    abrirSeccion("perfil");
    expect(screen.getByRole("heading", { name: "Actualizar mis datos" })).toBeInTheDocument();
  });

  it("Contraseña: muestra el formulario para cambiarla", () => {
    abrirSeccion("seguridad");
    expect(screen.getByRole("heading", { name: "Cambiar contraseña" })).toBeInTheDocument();
  });
});
