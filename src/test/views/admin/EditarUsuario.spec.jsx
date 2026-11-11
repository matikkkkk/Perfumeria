import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import EditarUsuario from "../../../pages/admin/EditarUsuario";

describe("Vista EditarUsuario", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<EditarUsuario />, "/admin/usuarios/1/editar", "/admin/usuarios/:id/editar"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
