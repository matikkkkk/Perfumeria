import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import DashboardAdmin from "../../../pages/admin/DashboardAdmin";

describe("Vista DashboardAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<DashboardAdmin />, "/admin", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
