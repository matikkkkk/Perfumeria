import { ROLES_SOLO_ADMIN, ROLES_STAFF, evaluarAcceso } from "./acceso";

const admin = { id: "1", tipo: "Administrador" };
const vendedor = { id: "2", tipo: "Vendedor" };
const cliente = { id: "3", tipo: "Cliente" };

describe("evaluarAcceso (lógica de RutaProtegida)", () => {
  it("sin sesión manda a login, con o sin roles exigidos", () => {
    expect(evaluarAcceso(null, ROLES_STAFF)).toBe("login");
    expect(evaluarAcceso(null)).toBe("login");
  });

  it("con roles vacíos solo exige estar logueado", () => {
    expect(evaluarAcceso(cliente)).toBe("permitido");
  });

  it("deja pasar a Administrador y Vendedor al panel", () => {
    expect(evaluarAcceso(admin, ROLES_STAFF)).toBe("permitido");
    expect(evaluarAcceso(vendedor, ROLES_STAFF)).toBe("permitido");
  });

  it("niega el panel a un Cliente con sesión", () => {
    expect(evaluarAcceso(cliente, ROLES_STAFF)).toBe("denegado");
  });

  it("las secciones solo-admin se niegan al Vendedor", () => {
    expect(evaluarAcceso(admin, ROLES_SOLO_ADMIN)).toBe("permitido");
    expect(evaluarAcceso(vendedor, ROLES_SOLO_ADMIN)).toBe("denegado");
  });
});
