import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import NuevoProducto from "../../../pages/admin/NuevoProducto";

describe("Vista NuevoProducto", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<NuevoProducto />, "/admin/productos/nuevo", "/admin/productos/nuevo");
    expect(container.firstChild).not.toBeNull();
  });
});
