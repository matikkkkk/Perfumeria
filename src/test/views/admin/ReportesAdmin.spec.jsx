import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import ReportesAdmin from "../../../pages/admin/ReportesAdmin";

describe("Vista ReportesAdmin", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<ReportesAdmin />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
