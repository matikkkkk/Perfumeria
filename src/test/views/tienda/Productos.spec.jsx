import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Productos from "../../../pages/tienda/Productos";

describe("Vista Productos", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Productos />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
