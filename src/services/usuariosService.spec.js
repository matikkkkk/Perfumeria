import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorAuth, usuariosService } from "./usuariosService";

const respuesta = (status, cuerpo) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(cuerpo),
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("usuariosService.login (POST /auth/login)", () => {
  it("envia el correo normalizado y devuelve el usuario sin password", async () => {
    const usuario = { id: "190110222", nombre: "Administrador", correo: "admin@duoc.cl", tipo: "Administrador" };
    const fetchFalso = vi.fn().mockResolvedValue(respuesta(200, usuario));
    vi.stubGlobal("fetch", fetchFalso);

    const resultado = await usuariosService.login("  Admin@Duoc.cl ", "admin123");

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/auth/login");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual({ correo: "admin@duoc.cl", password: "admin123" });
    expect(resultado).toEqual(usuario);
    expect(resultado).not.toHaveProperty("password");
  });

  it("un 401 con campo=correo se convierte en ErrorAuth del campo correo", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta(401, { status: 401, campo: "correo" })));

    const error = await usuariosService.login("nadie@gmail.com", "x").catch((e) => e);

    expect(error).toBeInstanceOf(ErrorAuth);
    expect(error.campo).toBe("correo");
    expect(error.message).toBe("Usuario no encontrado.");
  });

  it("un 401 con campo=password se convierte en ErrorAuth del campo password", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta(401, { status: 401, campo: "password" })));

    const error = await usuariosService.login("admin@duoc.cl", "mala").catch((e) => e);

    expect(error).toBeInstanceOf(ErrorAuth);
    expect(error.campo).toBe("password");
    expect(error.message).toBe("Contraseña incorrecta.");
  });

  it("si la API esta caida deja pasar el error original (no es un ErrorAuth)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const error = await usuariosService.login("admin@duoc.cl", "admin123").catch((e) => e);

    expect(error).not.toBeInstanceOf(ErrorAuth);
    expect(error.status).toBe(0);
  });
});
