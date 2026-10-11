import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Carrito from "../../../pages/tienda/Carrito";

describe("Vista Carrito", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Carrito />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
