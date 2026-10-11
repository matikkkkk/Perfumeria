import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import CerrarSesion from "../../../pages/tienda/CerrarSesion";

describe("Vista CerrarSesion", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<CerrarSesion />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
