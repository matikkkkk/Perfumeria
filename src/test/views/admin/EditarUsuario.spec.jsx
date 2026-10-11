import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import EditarUsuario from "../../../pages/admin/EditarUsuario";

describe("Vista EditarUsuario", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<EditarUsuario />, "/admin/usuarios/1/editar", "/admin/usuarios/:id/editar");
    expect(container.firstChild).not.toBeNull();
  });
});
