import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import ReportesProductos from "../../../pages/admin/ReportesProductos";

describe("Vista ReportesProductos", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<ReportesProductos />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
