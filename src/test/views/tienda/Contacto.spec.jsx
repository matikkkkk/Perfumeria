import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Contacto from "../../../pages/tienda/Contacto";

describe("Vista Contacto", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Contacto />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
