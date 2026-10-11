import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Categorias from "../../../pages/tienda/Categorias";

describe("Vista Categorias", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Categorias />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
