import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import DetalleProductoAdmin from "../../../pages/admin/DetalleProductoAdmin";

describe("Vista DetalleProductoAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<DetalleProductoAdmin />, "/admin/productos/1", "/admin/productos/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
