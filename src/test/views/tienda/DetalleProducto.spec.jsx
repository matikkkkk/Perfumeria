import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import DetalleProducto from "../../../pages/tienda/DetalleProducto";

describe("Vista DetalleProducto", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<DetalleProducto />, "/productos/1", "/productos/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
