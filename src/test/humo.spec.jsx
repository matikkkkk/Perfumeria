import { render, screen } from "@testing-library/react";
import { peticion } from "../services/api";
import { formatearPrecio } from "../utils/formato";
import { renderConApp } from "./utils";
import { useAuth } from "../context/AuthContext";

// Prueba de humo: comprueba que TODA la cadena de pruebas funciona
// (Vitest -> Vite -> JSX -> Testing Library -> React en jsdom).
// Si esta falla, el problema es de configuracion, no de la app.
describe("prueba de humo del entorno de pruebas", () => {
  it("Vitest ejecuta pruebas", () => {
    expect(1 + 1).toBe(2);
    expect(vi).toBeDefined();
  });

  it("Vite transforma JSX y React pinta en el DOM", () => {
    render(<h1>Luxury</h1>);
    expect(screen.getByRole("heading", { name: "Luxury" })).toBeInTheDocument();
  });

  it("los imports del proyecto se resuelven sin extension", () => {
    expect(formatearPrecio(28000)).toBe("$28.000");
  });

  it("import.meta.env está definido: services/api.js arma la URL con VITE_API_URL", async () => {
    const falsoFetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    vi.stubGlobal("fetch", falsoFetch);
    try {
      await peticion("/productos");
      expect(falsoFetch).toHaveBeenCalledWith("http://localhost:8080/api/productos", expect.any(Object));
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("los contextos y el router montan: useAuth devuelve la sesión guardada en localStorage", () => {
    function MuestraRol() {
      const { usuario } = useAuth();
      return <p>{usuario ? usuario.tipo : "sin sesión"}</p>;
    }

    renderConApp(<MuestraRol />);
    expect(screen.getByText("sin sesión")).toBeInTheDocument();
  });

  it("localStorage se limpia entre pruebas (setupTests.js)", () => {
    expect(localStorage.length).toBe(0);
  });
});
