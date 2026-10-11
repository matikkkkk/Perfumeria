import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import DetalleProducto from "../../../pages/tienda/DetalleProducto";

describe("Vista DetalleProducto", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<DetalleProducto />, "/productos/1", "/productos/:id");
    expect(container.firstChild).not.toBeNull();
  });
});
