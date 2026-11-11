// Reglas de acceso por rol. Son puras (sin React ni DOM): las usan RutaProtegida y el menú del admin,
// y por eso se pueden probar con Jasmine sin renderizar nada.

// Roles de la BD (usuarios.tipo). "Cliente" no entra al panel.
export const ROLES_STAFF = ["Administrador", "Vendedor"]; // pueden entrar al panel /admin
export const ROLES_SOLO_ADMIN = ["Administrador"]; // secciones que el Vendedor no ve

// Devuelve qué debe hacer una ruta protegida con este usuario:
//   "login"     -> no hay sesión: mandar a /login
//   "denegado"  -> hay sesión pero el rol no alcanza: mandar a /acceso-denegado
//   "permitido" -> mostrar la página
// Con roles = [] solo se exige estar logueado.
export function evaluarAcceso(usuario, roles = []) {
  if (!usuario) return "login";
  if (roles.length === 0) return "permitido";
  return roles.includes(usuario.tipo) ? "permitido" : "denegado";
}
