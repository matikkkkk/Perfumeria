import { createContext, useCallback, useContext, useMemo } from "react";
import { useStorage } from "../hooks/useStorage";
import { usuariosService } from "../services/usuariosService";
import { ROLES_STAFF } from "../utils/acceso";

// Roles de la BD (usuarios.tipo). El panel admin lo pueden ver Administrador y Vendedor.
export const ROLES_ADMIN = ROLES_STAFF;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Clave "usuarioActual": la misma que usaba el HTML. Nunca contiene password (login() ya la descarta).
  const [usuario, setUsuario] = useStorage("usuarioActual", null);

  // Lanza ErrorAuth { campo: "correo" | "password" } si las credenciales fallan:
  // el formulario de login lo captura y muestra el mensaje bajo el campo correcto.
  const iniciarSesion = useCallback(
    async (correo, password) => {
      const encontrado = await usuariosService.login(correo, password);
      setUsuario(encontrado);
      return encontrado;
    },
    [setUsuario]
  );

  const cerrarSesion = useCallback(() => setUsuario(null), [setUsuario]);

  // Para cuando el perfil cambia datos del usuario logueado (etapa 11).
  const actualizarSesion = useCallback(
    (cambios) => setUsuario((actual) => (actual ? { ...actual, ...cambios } : actual)),
    [setUsuario]
  );

  const valor = useMemo(
    () => ({
      usuario,
      estaAutenticado: usuario !== null,
      esAdministrador: usuario?.tipo === "Administrador",
      esVendedor: usuario?.tipo === "Vendedor",
      esStaff: ROLES_ADMIN.includes(usuario?.tipo),
      // tieneRol("Administrador") o tieneRol("Administrador", "Vendedor"): lo usa RutaProtegida (etapa 3)
      tieneRol: (...roles) => usuario !== null && roles.includes(usuario.tipo),
      iniciarSesion,
      cerrarSesion,
      actualizarSesion,
    }),
    [usuario, iniciarSesion, cerrarSesion, actualizarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
