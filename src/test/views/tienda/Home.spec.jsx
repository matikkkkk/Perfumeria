import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Home from "../../../pages/tienda/Home";

describe("Vista Home", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Home />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
