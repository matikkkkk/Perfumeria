import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Registro from "../../../pages/tienda/Registro";

describe("Vista Registro", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Registro />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
