import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import UsuariosAdmin from "../../../pages/admin/UsuariosAdmin";

describe("Vista UsuariosAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<UsuariosAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
