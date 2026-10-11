import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import CategoriasAdmin from "../../../pages/admin/CategoriasAdmin";

describe("Vista CategoriasAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<CategoriasAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
