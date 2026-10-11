import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import DetalleBlog from "../../../pages/tienda/DetalleBlog";

describe("Vista DetalleBlog", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<DetalleBlog />, "/blogs/1", "/blogs/:id");
    expect(container.firstChild).not.toBeNull();
  });
});
