import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppProviders from "../context/AppProviders";

// Renderiza un componente con lo mismo que tiene en la app real: router + Auth + Carrito + Wishlist.
//   renderConApp(<Navbar />)
//   renderConApp(<Navbar />, { ruta: "/productos?buscar=ambar", usuario: { id: "1", tipo: "Administrador" } })
// `usuario` simula una sesion iniciada (se guarda en la misma clave que usa AuthContext).
export function renderConApp(ui, { ruta = "/", usuario = null } = {}) {
  if (usuario) localStorage.setItem("usuarioActual", JSON.stringify(usuario));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AppProviders>{ui}</AppProviders>
    </MemoryRouter>
  );
}

// Usuarios de ejemplo para las pruebas de acceso por rol.
export const USUARIOS_PRUEBA = {
  admin: { id: "11111111K", nombre: "Ada", tipo: "Administrador" },
  vendedor: { id: "22222222K", nombre: "Vera", tipo: "Vendedor" },
  cliente: { id: "33333333K", nombre: "Caro", tipo: "Cliente" },
};
