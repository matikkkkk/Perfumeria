import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import NuevoProducto from "../../../pages/admin/NuevoProducto";

describe("Vista NuevoProducto", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<NuevoProducto />, "/admin/productos/nuevo", "/admin/productos/nuevo"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
