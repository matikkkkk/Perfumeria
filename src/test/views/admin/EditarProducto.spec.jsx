import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import EditarProducto from "../../../pages/admin/EditarProducto";

describe("Vista EditarProducto", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<EditarProducto />, "/admin/productos/1/editar", "/admin/productos/:id/editar");
    expect(container.firstChild).not.toBeNull();
  });
});
