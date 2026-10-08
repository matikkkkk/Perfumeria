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

  // MOCK: consulta /usuarios y compara la contrasena aqui mismo (json-server no tiene /auth/login).
  // Con Spring Boot (etapa 15-17) solo cambia el cuerpo: POST /auth/login con BCrypt en el servidor.
  // La firma login(correo, password) -> usuario SIN password se mantiene, el resto del front no se entera.
  async login(correo, password) {
    const correoNormalizado = correo.trim().toLowerCase();
    const encontrados = await peticion(`/usuarios?correo=${encodeURIComponent(correoNormalizado)}`);
    const usuario = encontrados[0];

    if (!usuario) throw new ErrorAuth("correo", "Usuario no encontrado.");
    if (usuario.password !== password) throw new ErrorAuth("password", "Contraseña incorrecta.");

    const { password: _descartada, ...usuarioSeguro } = usuario;
    return usuarioSeguro;
  },
};
