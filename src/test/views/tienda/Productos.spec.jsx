import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Productos from "../../../pages/tienda/Productos";

describe("Vista Productos", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Productos />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
