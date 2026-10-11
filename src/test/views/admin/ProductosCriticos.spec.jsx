import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import ProductosCriticos from "../../../pages/admin/ProductosCriticos";

describe("Vista ProductosCriticos", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<ProductosCriticos />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
