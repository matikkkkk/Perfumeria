import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import AccesoDenegado from "../../../pages/tienda/AccesoDenegado";

describe("Vista AccesoDenegado", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<AccesoDenegado />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
