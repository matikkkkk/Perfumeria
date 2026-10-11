import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import PagoError from "../../../pages/tienda/PagoError";

describe("Vista PagoError", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<PagoError />, "/pago-error/1", "/pago-error/:ordenId"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
