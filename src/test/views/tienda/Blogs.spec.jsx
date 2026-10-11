import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import Blogs from "../../../pages/tienda/Blogs";

describe("Vista Blogs", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<Blogs />, "/", "*");
    expect(container.firstChild).not.toBeNull();
  });
});
