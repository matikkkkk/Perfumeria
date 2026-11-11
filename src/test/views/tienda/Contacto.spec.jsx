import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Contacto from "../../../pages/tienda/Contacto";

describe("Vista Contacto", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Contacto />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
