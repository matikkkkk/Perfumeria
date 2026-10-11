import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import NoEncontrada from "../../../pages/tienda/NoEncontrada";

describe("Vista NoEncontrada", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<NoEncontrada />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
