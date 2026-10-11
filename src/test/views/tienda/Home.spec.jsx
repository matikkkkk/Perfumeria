import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Home from "../../../pages/tienda/Home";

describe("Vista Home", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Home />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
