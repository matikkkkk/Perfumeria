import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import OrdenesAdmin from "../../../pages/admin/OrdenesAdmin";

describe("Vista OrdenesAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<OrdenesAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
