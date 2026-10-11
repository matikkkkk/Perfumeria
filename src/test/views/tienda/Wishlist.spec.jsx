import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Wishlist from "../../../pages/tienda/Wishlist";

describe("Vista Wishlist", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Wishlist />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
