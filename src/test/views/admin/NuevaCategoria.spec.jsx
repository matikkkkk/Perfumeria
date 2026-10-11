import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import NuevaCategoria from "../../../pages/admin/NuevaCategoria";

describe("Vista NuevaCategoria", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<NuevaCategoria />, "/admin/categorias/nueva", "/admin/categorias/nueva");
    expect(container.firstChild).not.toBeNull();
  });
});
