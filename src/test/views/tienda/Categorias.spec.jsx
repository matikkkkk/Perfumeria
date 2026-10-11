import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Categorias from "../../../pages/tienda/Categorias";

describe("Vista Categorias", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Categorias />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
