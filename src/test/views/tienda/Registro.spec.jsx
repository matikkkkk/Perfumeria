import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Registro from "../../../pages/tienda/Registro";

describe("Vista Registro", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Registro />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
