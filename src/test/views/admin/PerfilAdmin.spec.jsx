import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import PerfilAdmin from "../../../pages/admin/PerfilAdmin";

describe("Vista PerfilAdmin", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<PerfilAdmin />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
