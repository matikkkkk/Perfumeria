import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import ReportesAdmin from "../../../pages/admin/ReportesAdmin";

describe("Vista ReportesAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<ReportesAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
