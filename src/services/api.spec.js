import { afterEach, describe, expect, it, vi } from "vitest";
import { peticion } from "./api";

// Respuesta falsa minima de fetch
const respuesta = (status, cuerpo) => ({
  ok: status >= 200 && status < 300,
  status,
  json: cuerpo === undefined ? () => Promise.reject(new SyntaxError("sin cuerpo")) : () => Promise.resolve(cuerpo),
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("peticion (cliente HTTP hacia el gateway)", () => {
  it("llama a la URL base de la API y devuelve el JSON", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta(200, [{ id: "1" }]));
    vi.stubGlobal("fetch", fetchFalso);

    const datos = await peticion("/productos");

    expect(fetchFalso).toHaveBeenCalledWith("http://localhost:8080/api/productos", expect.objectContaining({
      headers: { "Content-Type": "application/json" },
    }));
    expect(datos).toEqual([{ id: "1" }]);
  });

  it("devuelve null en un 204 (DELETE sin cuerpo)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta(204)));
    expect(await peticion("/productos/1", { method: "DELETE" })).toBeNull();
  });

  it("guarda status y el cuerpo del error del backend", async () => {
    const cuerpo = { status: 401, error: "Unauthorized", mensaje: "Contraseña incorrecta", campo: "password" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta(401, cuerpo)));

    await expect(peticion("/auth/login", { method: "POST" })).rejects.toMatchObject({ status: 401, cuerpo });
  });

  it("tolera un error sin cuerpo JSON (ej. 502 del gateway)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta(502)));

    await expect(peticion("/ordenes")).rejects.toMatchObject({ status: 502, cuerpo: null });
  });

  it("marca status 0 cuando no hay conexion (gateway apagado o CORS)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(peticion("/ordenes")).rejects.toMatchObject({ status: 0 });
  });
});
