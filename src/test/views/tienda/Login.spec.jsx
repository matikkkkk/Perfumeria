import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Login from "../../../pages/tienda/Login";

describe("Vista Login", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Login />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
