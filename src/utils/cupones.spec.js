import { CUPONES, cuponValido, porcentajeCupon, calcularDescuento, calcularTotales } from "./cupones";

describe("cupones", () => {
  it("reconoce los cupones sin importar mayúsculas ni espacios", () => {
    expect(cuponValido("luxury10")).toBeTrue();
    expect(cuponValido("  BIENVENIDO15 ")).toBeTrue();
  });

  it("rechaza códigos inexistentes, vacíos y propiedades heredadas de Object", () => {
    expect(cuponValido("NOEXISTE")).toBeFalse();
    expect(cuponValido("")).toBeFalse();
    expect(cuponValido("constructor")).toBeFalse();
  });

  it("entrega el porcentaje, o 0 si no existe", () => {
    expect(porcentajeCupon("LUXURY10")).toBe(CUPONES.LUXURY10);
    expect(porcentajeCupon("NOEXISTE")).toBe(0);
  });

  it("calcula descuento redondeado y total", () => {
    expect(calcularDescuento(28000, "LUXURY10")).toBe(2800);
    expect(calcularDescuento(33333, "BIENVENIDO15")).toBe(5000); // 4999.95 -> 5000
    expect(calcularTotales(28000, "LUXURY10")).toEqual({ subtotal: 28000, descuento: 2800, total: 25200 });
  });

  it("sin cupón no descuenta nada", () => {
    expect(calcularTotales(28000, null)).toEqual({ subtotal: 28000, descuento: 0, total: 28000 });
  });
});
