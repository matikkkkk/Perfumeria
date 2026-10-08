import { ROLES_SOLO_ADMIN, ROLES_STAFF } from "../utils/acceso";

// Opciones del menú lateral del panel. Un solo lugar define quién ve qué;
// AppRoutes usa los mismos grupos de roles para proteger las rutas, así menú y rutas no se contradicen.
export const MENU_ADMIN = [
  { to: "/admin", etiqueta: "Dashboard", end: true, roles: ROLES_STAFF },
  { to: "/admin/ordenes", etiqueta: "Órdenes", roles: ROLES_STAFF },
  { to: "/admin/productos", etiqueta: "Productos", roles: ROLES_STAFF },
  { to: "/admin/categorias", etiqueta: "Categorías", roles: ROLES_SOLO_ADMIN },
  { to: "/admin/usuarios", etiqueta: "Usuarios", roles: ROLES_SOLO_ADMIN },
  { to: "/admin/reportes", etiqueta: "Reportes", roles: ROLES_STAFF },
  { to: "/admin/perfil", etiqueta: "Perfil", roles: ROLES_STAFF },
];

// Opciones que puede ver un usuario según su tipo.
export function menuParaUsuario(usuario) {
  if (!usuario) return [];
  return MENU_ADMIN.filter((opcion) => opcion.roles.includes(usuario.tipo));
}
