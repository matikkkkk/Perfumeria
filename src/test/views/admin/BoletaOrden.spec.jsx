import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import BoletaOrden from "../../../pages/admin/BoletaOrden";

describe("Vista BoletaOrden", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<BoletaOrden />, "/admin/ordenes/1", "/admin/ordenes/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
