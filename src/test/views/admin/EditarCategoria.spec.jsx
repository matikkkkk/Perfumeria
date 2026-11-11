import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import EditarCategoria from "../../../pages/admin/EditarCategoria";

describe("Vista EditarCategoria", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<EditarCategoria />, "/admin/categorias/1/editar", "/admin/categorias/:id/editar"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
