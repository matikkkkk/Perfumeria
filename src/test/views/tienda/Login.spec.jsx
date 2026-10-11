import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import Login from "../../../pages/tienda/Login";

describe("Vista Login", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<Login />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
