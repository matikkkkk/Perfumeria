import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import PerfilAdmin from "../../../pages/admin/PerfilAdmin";

describe("Vista PerfilAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<PerfilAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
