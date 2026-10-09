import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PerfilAdmin from "./PerfilAdmin";
import { AuthProvider } from "../../context/AuthContext";
import { usuariosService } from "../../services/usuariosService";

vi.mock("../../services/usuariosService", () => ({ usuariosService: { modificar: vi.fn(), login: vi.fn(), listar: vi.fn(), obtener: vi.fn(), crear: vi.fn(), actualizar: vi.fn(), eliminar: vi.fn() } }));

function renderPerfil() {
  localStorage.setItem("usuarioActual", JSON.stringify({ run: "19011022K", nombre: "Admin", apellidos: "Luxury", correo: "admin@duoc.cl", tipo: "Administrador", region: "RM", comuna: "Santiago", direccion: "Centro" }));
  return render(<MemoryRouter><AuthProvider><PerfilAdmin /></AuthProvider></MemoryRouter>);
}

describe("PerfilAdmin", () => {
  it("guarda los cambios y actualiza el mensaje de confirmación", async () => {
    usuariosService.modificar.mockResolvedValue({});
    renderPerfil();
    fireEvent.change(screen.getByLabelText("Nombre *"), { target: { value: "Felipe" } });
    fireEvent.click(screen.getByRole("button", { name: /Guardar cambios/i }));
    await waitFor(() => expect(usuariosService.modificar).toHaveBeenCalledWith("19011022K", expect.objectContaining({ nombre: "Felipe" })));
    expect(await screen.findByRole("status")).toHaveTextContent("Tus datos se guardaron correctamente.");
  });
});
