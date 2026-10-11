import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import DetalleBlog from "../../../pages/tienda/DetalleBlog";

describe("Vista DetalleBlog", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<DetalleBlog />, "/blogs/1", "/blogs/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
