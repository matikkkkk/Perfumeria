import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import CategoriasAdmin from "../../../pages/admin/CategoriasAdmin";

describe("Vista CategoriasAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<CategoriasAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
