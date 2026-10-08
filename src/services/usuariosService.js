import { crearRecurso, peticion } from "./api";

export const usuariosService = {
  ...crearRecurso("/usuarios"),
  // El backend debe validar credenciales; el front no compara contrasenas.
  login: (correo, password) =>
    peticion("/auth/login", { method: "POST", body: JSON.stringify({ correo, password }) }),
};
