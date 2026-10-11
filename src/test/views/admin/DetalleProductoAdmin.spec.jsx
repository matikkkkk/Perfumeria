import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import DetalleProductoAdmin from "../../../pages/admin/DetalleProductoAdmin";

describe("Vista DetalleProductoAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<DetalleProductoAdmin />, "/admin/productos/1", "/admin/productos/:id");
    expect(container.firstChild).not.toBeNull();
  });
});
