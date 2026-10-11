import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Checkout from "../../../pages/tienda/Checkout";

describe("Vista Checkout", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Checkout />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
