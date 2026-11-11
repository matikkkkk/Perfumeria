import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import PagoCorrecto from "../../../pages/tienda/PagoCorrecto";

describe("Vista PagoCorrecto", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<PagoCorrecto />, "/pago-correcto/1", "/pago-correcto/:ordenId"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
