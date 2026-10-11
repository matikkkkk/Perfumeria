import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import EditarProducto from "../../../pages/admin/EditarProducto";

describe("Vista EditarProducto", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<EditarProducto />, "/admin/productos/1/editar", "/admin/productos/:id/editar"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
