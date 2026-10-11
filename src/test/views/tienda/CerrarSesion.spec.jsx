import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import CerrarSesion from "../../../pages/tienda/CerrarSesion";

describe("Vista CerrarSesion", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<CerrarSesion />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
