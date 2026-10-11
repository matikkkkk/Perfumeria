import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import HistorialCompras from "../../../pages/admin/HistorialCompras";

describe("Vista HistorialCompras", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<HistorialCompras />, "/admin/usuarios/1/compras", "/admin/usuarios/:id/compras");
    expect(container.firstChild).not.toBeNull();
  });
});
