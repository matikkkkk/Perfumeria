import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import UsuariosAdmin from "../../../pages/admin/UsuariosAdmin";

describe("Vista UsuariosAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<UsuariosAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
