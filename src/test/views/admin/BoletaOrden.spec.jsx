import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import BoletaOrden from "../../../pages/admin/BoletaOrden";

describe("Vista BoletaOrden", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<BoletaOrden />, "/admin/ordenes/1", "/admin/ordenes/:id");
    expect(container.firstChild).not.toBeNull();
  });
});
