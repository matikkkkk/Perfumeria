import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Nosotros from "../../../pages/tienda/Nosotros";

describe("Vista Nosotros", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Nosotros />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
