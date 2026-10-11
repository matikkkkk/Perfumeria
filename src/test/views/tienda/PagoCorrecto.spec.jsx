import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import PagoCorrecto from "../../../pages/tienda/PagoCorrecto";

describe("Vista PagoCorrecto", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<PagoCorrecto />, "/pago-correcto/1", "/pago-correcto/:ordenId");
    expect(container.firstChild).not.toBeNull();
  });
});
