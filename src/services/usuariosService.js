import { crearRecurso, peticion } from "./api";

// Error de login que indica en que campo mostrar el mensaje (igual que mostrarError() del HTML original).
export class ErrorAuth extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorAuth";
    this.campo = campo; // "correo" | "password"
  }
}

export const usuariosService = {
  ...crearRecurso("/usuarios"),
  cambiarPassword(id, datos) {
    return peticion(`/usuarios/${encodeURIComponent(id)}/cambiar-password`, {
      method: "POST", body: JSON.stringify(datos),
    });
  },

  loginGoogle(credential) {
    return peticion("/auth/google", {
      method: "POST", body: JSON.stringify({ credential }),
    });
  },

  // POST /auth/login (ms-usuarios): la contrasena se compara en el servidor con BCrypt y nunca vuelve en la respuesta.
  // 200 -> usuario sin password. 401 -> { campo: "correo" | "password" }, que se traduce a ErrorAuth para mostrar
  // el mensaje bajo el campo correcto (igual que mostrarError() del HTML original).
  async login(correo, password) {
    try {
      return await peticion("/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo: correo.trim().toLowerCase(), password }),
      });
    } catch (err) {
      if (err.status === 401) {
        const campo = err.cuerpo?.campo === "correo" ? "correo" : "password";
        throw new ErrorAuth(campo, campo === "correo" ? "Usuario no encontrado." : "Contraseña incorrecta.");
      }
      throw err; // API caida (status 0), 400, 500...: la pantalla muestra el mensaje generico
    }
  },
};
