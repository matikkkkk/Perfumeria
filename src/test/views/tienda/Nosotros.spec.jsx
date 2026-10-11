import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Nosotros from "../../../pages/tienda/Nosotros";

describe("Vista Nosotros", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Nosotros />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
