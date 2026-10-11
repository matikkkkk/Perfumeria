import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Checkout from "../../../pages/tienda/Checkout";

describe("Vista Checkout", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Checkout />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
