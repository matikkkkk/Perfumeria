import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import NoEncontrada from "../../../pages/tienda/NoEncontrada";

describe("Vista NoEncontrada", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<NoEncontrada />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
