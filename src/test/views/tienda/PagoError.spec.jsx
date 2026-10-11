import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import PagoError from "../../../pages/tienda/PagoError";

describe("Vista PagoError", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<PagoError />, "/pago-error/1", "/pago-error/:ordenId");
    expect(container.firstChild).not.toBeNull();
  });
});
