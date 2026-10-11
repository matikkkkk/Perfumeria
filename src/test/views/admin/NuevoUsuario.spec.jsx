import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import NuevoUsuario from "../../../pages/admin/NuevoUsuario";

describe("Vista NuevoUsuario", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<NuevoUsuario />, "/admin/usuarios/nuevo", "/admin/usuarios/nuevo");
    expect(container.firstChild).not.toBeNull();
  });
});
