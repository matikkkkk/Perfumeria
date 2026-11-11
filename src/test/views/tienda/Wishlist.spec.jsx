import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Wishlist from "../../../pages/tienda/Wishlist";

describe("Vista Wishlist", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Wishlist />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
