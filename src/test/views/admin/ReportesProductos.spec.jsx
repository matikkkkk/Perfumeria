import { describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { renderVista } from "../../renderVista";
import ReportesProductos from "../../../pages/admin/ReportesProductos";

describe("Vista ReportesProductos", () => {
  it("se renderiza sin errores", async () => {
    let container;
    await act(async () => {
      ({ container } = renderVista(<ReportesProductos />, "/", "*"));
    });
    expect(container.firstChild).not.toBeNull();
  });
});
