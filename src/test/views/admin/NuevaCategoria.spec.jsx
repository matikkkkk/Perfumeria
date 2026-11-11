import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import NuevaCategoria from "../../../pages/admin/NuevaCategoria";

describe("Vista NuevaCategoria", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<NuevaCategoria />, "/admin/categorias/nueva", "/admin/categorias/nueva"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
