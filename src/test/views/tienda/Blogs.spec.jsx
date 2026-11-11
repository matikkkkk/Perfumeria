import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Blogs from "../../../pages/tienda/Blogs";

describe("Vista Blogs", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Blogs />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
