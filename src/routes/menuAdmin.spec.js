import { MENU_ADMIN, menuParaUsuario } from "./menuAdmin";

const etiquetas = (usuario) => menuParaUsuario(usuario).map((o) => o.etiqueta);

describe("menú lateral del admin según el rol", () => {
  it("el Administrador ve todas las opciones", () => {
    expect(menuParaUsuario({ tipo: "Administrador" }).length).toBe(MENU_ADMIN.length);
  });

  it("el Vendedor no ve Usuarios ni Categorías, pero sí Órdenes y Productos", () => {
    const vistas = etiquetas({ tipo: "Vendedor" });
    expect(vistas).toContain("Órdenes");
    expect(vistas).toContain("Productos");
    expect(vistas).not.toContain("Usuarios");
    expect(vistas).not.toContain("Categorías");
  });

  it("sin sesión o con un Cliente el menú queda vacío", () => {
    expect(menuParaUsuario(null)).toEqual([]);
    expect(menuParaUsuario({ tipo: "Cliente" })).toEqual([]);
  });
});
