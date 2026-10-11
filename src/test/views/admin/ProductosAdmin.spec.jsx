import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import ProductosAdmin from "../../../pages/admin/ProductosAdmin";

describe("Vista ProductosAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<ProductosAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
