import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import AccesoDenegado from "../../../pages/tienda/AccesoDenegado";

describe("Vista AccesoDenegado", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<AccesoDenegado />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
