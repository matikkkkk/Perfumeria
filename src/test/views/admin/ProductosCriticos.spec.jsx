import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import ProductosCriticos from "../../../pages/admin/ProductosCriticos";

describe("Vista ProductosCriticos", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<ProductosCriticos />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
