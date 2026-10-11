import { describe, expect, it } from "vitest";
import { renderVista } from "../../renderVista";
import CategoriaDetalle from "../../../pages/tienda/CategoriaDetalle";

describe("Vista CategoriaDetalle", () => {
  it("se renderiza sin errores", () => {
    const { container } = renderVista(<CategoriaDetalle />, "/categorias/1", "/categorias/:id");
    expect(container.firstChild).not.toBeNull();
  });
});
