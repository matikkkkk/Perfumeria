import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderConApp } from "../../test/utils";
import Login from "./Login";

vi.mock("../../services/usuariosService", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, usuariosService: { ...actual.usuariosService, login: vi.fn().mockRejectedValue(new actual.ErrorAuth("correo", "Usuario no encontrado.")) } };
});

describe("Login (eventos)", () => {
  it("muestra el error de credenciales cuando el inicio de sesión falla", async () => {
    const user = userEvent.setup();
    renderConApp(<Login />);
    await user.type(screen.getByLabelText("Correo electrónico"), "noexiste@correo.cl");
    await user.type(screen.getByLabelText("Contraseña"), "incorrecta");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Usuario no encontrado.");
  });
});
