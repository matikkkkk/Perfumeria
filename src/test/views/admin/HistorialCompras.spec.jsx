import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import HistorialCompras from "../../../pages/admin/HistorialCompras";

describe("Vista HistorialCompras", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<HistorialCompras />, "/admin/usuarios/1/compras", "/admin/usuarios/:id/compras"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
