import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import NuevoUsuario from "../../../pages/admin/NuevoUsuario";

describe("Vista NuevoUsuario", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<NuevoUsuario />, "/admin/usuarios/nuevo", "/admin/usuarios/nuevo"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
