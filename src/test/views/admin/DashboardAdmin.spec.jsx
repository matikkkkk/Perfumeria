import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import DashboardAdmin from "../../../pages/admin/DashboardAdmin";

describe("Vista DashboardAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<DashboardAdmin />, "/admin", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
