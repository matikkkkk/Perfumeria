import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import OrdenesAdmin from "../../../pages/admin/OrdenesAdmin";

describe("Vista OrdenesAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<OrdenesAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
