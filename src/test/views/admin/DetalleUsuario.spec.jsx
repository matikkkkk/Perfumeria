import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import DetalleUsuario from "../../../pages/admin/DetalleUsuario";

describe("Vista DetalleUsuario", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<DetalleUsuario />, "/admin/usuarios/1", "/admin/usuarios/:id"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
