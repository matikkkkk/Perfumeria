import { limpiarRun, validarCorreo, validarRun, validarFormulario, reglasCampos } from "./validaciones";

describe("validaciones", () => {
  describe("limpiarRun", () => {
    it("quita puntos y guion y pasa a mayúsculas", () => {
      expect(limpiarRun("19.011.022-k")).toBe("19011022K");
    });
  });

  describe("validarRun", () => {
    it("acepta RUN con dígito verificador correcto, con o sin formato", () => {
      expect(validarRun("20987654K")).toBeTrue();
      expect(validarRun("12.345.678-5")).toBeTrue();
      expect(validarRun("111111111")).toBeTrue();
    });

    it("rechaza dígito verificador incorrecto", () => {
      expect(validarRun("123456780")).toBeFalse();
    });

    it("rechaza largo o caracteres inválidos", () => {
      expect(validarRun("123")).toBeFalse();
      expect(validarRun("ABCDEFGH1")).toBeFalse();
      expect(validarRun("")).toBeFalse();
    });
  });

  describe("validarCorreo", () => {
    it("acepta solo los dominios permitidos", () => {
      expect(validarCorreo("ana@duoc.cl")).toBeTrue();
      expect(validarCorreo("ana@profesor.duoc.cl")).toBeTrue();
      expect(validarCorreo("Ana@GMAIL.com")).toBeTrue();
    });

    it("rechaza otros dominios y formatos rotos", () => {
      expect(validarCorreo("ana@hotmail.com")).toBeFalse();
      expect(validarCorreo("ana@duoc.cl.evil.com")).toBeFalse();
      expect(validarCorreo("ana duoc.cl")).toBeFalse();
      expect(validarCorreo("")).toBeFalse();
    });
  });

  describe("validarFormulario", () => {
    it("devuelve {} cuando todo es válido", () => {
      const errores = validarFormulario({ run: "20987654K", correo: "ana@duoc.cl", password: "abcd", passwordConfirm: "abcd" });
      expect(errores).toEqual({});
    });

    it("devuelve solo los campos con error, con su mensaje", () => {
      const errores = validarFormulario({ correo: "ana@hotmail.com", password: "abcd", passwordConfirm: "otra" });
      expect(Object.keys(errores).sort()).toEqual(["correo", "passwordConfirm"]);
      expect(errores.passwordConfirm).toBe("Las contraseñas no coinciden.");
    });

    it("ignora campos sin regla", () => {
      expect(validarFormulario({ indicaciones: "x".repeat(500) })).toEqual({});
    });
  });

  describe("reglasCampos", () => {
    it("valida el vencimiento de tarjeta en formato MM/AA", () => {
      expect(reglasCampos.vencimiento("12/28")).toBe("");
      expect(reglasCampos.vencimiento("13/28")).toBe("Formato inválido. Usa MM/AA.");
    });
  });
});
