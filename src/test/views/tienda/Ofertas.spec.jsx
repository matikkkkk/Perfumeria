import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Ofertas from "../../../pages/tienda/Ofertas";

describe("Vista Ofertas", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Ofertas />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
