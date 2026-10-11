import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Carrito from "../../../pages/tienda/Carrito";

describe("Vista Carrito", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Carrito />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
