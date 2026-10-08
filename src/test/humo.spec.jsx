import { render, screen } from "@testing-library/react";
import { peticion } from "../services/api";
import { formatearPrecio } from "../utils/formato";
import { renderConApp } from "./utils";
import { useAuth } from "../context/AuthContext";

// Prueba de humo: comprueba que TODA la cadena de pruebas funciona
// (Karma -> webpack -> Babel -> Jasmine -> React en el DOM del navegador).
// Si esta falla, el problema es de configuracion, no de la app.
describe("prueba de humo del entorno de pruebas", () => {
  it("Jasmine ejecuta pruebas", () => {
    expect(1 + 1).toBe(2);
    expect(jasmine).toBeDefined();
  });

  it("Babel transforma JSX y React pinta en el DOM", () => {
    render(<h1>Luxury</h1>);
    expect(screen.getByRole("heading", { name: "Luxury" })).toBeTruthy();
  });

  it("webpack resuelve imports del proyecto sin extension", () => {
    expect(formatearPrecio(28000)).toBe("$28.000");
  });

  it("import.meta.env está definido: services/api.js arma la URL con VITE_API_URL", async () => {
    const original = window.fetch;
    const falsoFetch = jasmine.createSpy("fetch").and.resolveTo({ ok: true, status: 200, json: async () => [] });
    window.fetch = falsoFetch;
    try {
      await peticion("/productos");
      expect(falsoFetch).toHaveBeenCalledWith("http://localhost:8080/api/productos", jasmine.any(Object));
    } finally {
      window.fetch = original;
    }
  });

  it("los contextos y el router montan: useAuth devuelve la sesión guardada en localStorage", () => {
    function MuestraRol() {
      const { usuario } = useAuth();
      return <p>{usuario ? usuario.tipo : "sin sesión"}</p>;
    }

    renderConApp(<MuestraRol />);
    expect(screen.getByText("sin sesión")).toBeTruthy();
  });

  it("localStorage se limpia entre pruebas (setup.js)", () => {
    expect(localStorage.length).toBe(0);
  });
});
