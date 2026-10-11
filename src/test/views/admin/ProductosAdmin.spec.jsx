import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import ProductosAdmin from "../../../pages/admin/ProductosAdmin";

describe("Vista ProductosAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<ProductosAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
