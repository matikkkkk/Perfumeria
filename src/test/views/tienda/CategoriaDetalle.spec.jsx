import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import CategoriaDetalle from "../../../pages/tienda/CategoriaDetalle";

describe("Vista CategoriaDetalle", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<CategoriaDetalle />, "/categorias/1", "/categorias/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
