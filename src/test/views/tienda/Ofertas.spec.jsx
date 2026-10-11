import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Ofertas from "../../../pages/tienda/Ofertas";

describe("Vista Ofertas", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Ofertas />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
