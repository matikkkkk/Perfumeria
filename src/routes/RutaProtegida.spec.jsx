import { screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import { ROLES_SOLO_ADMIN, ROLES_STAFF } from "../utils/acceso";
import { renderConApp, USUARIOS_PRUEBA } from "../test/utils";

// Muestra a dónde terminó el usuario y el `state.desde` que dejó la redirección.
function Destino({ nombre }) {
  const { state } = useLocation();
  return (
    <p>
      {nombre}
      {state?.desde ? ` (desde ${state.desde})` : ""}
    </p>
  );
}

function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Destino nombre="LOGIN" />} />
      <Route path="/acceso-denegado" element={<Destino nombre="DENEGADO" />} />
      <Route path="/admin" element={<RutaProtegida roles={ROLES_STAFF} />}>
        <Route index element={<Destino nombre="PANEL" />} />
        <Route element={<RutaProtegida roles={ROLES_SOLO_ADMIN} />}>
          <Route path="usuarios" element={<Destino nombre="USUARIOS" />} />
        </Route>
      </Route>
    </Routes>
  );
}

describe("RutaProtegida (con DOM y router)", () => {
  it("sin sesión redirige a /login y recuerda la ruta pedida", () => {
    renderConApp(<Rutas />, { ruta: "/admin" });
    expect(screen.getByText("LOGIN (desde /admin)")).toBeTruthy();
  });

  it("un Cliente con sesión es enviado a /acceso-denegado", () => {
    renderConApp(<Rutas />, { ruta: "/admin", usuario: USUARIOS_PRUEBA.cliente });
    expect(screen.getByText(/DENEGADO/)).toBeTruthy();
  });

  it("el Vendedor entra al panel", () => {
    renderConApp(<Rutas />, { ruta: "/admin", usuario: USUARIOS_PRUEBA.vendedor });
    expect(screen.getByText("PANEL")).toBeTruthy();
  });

  it("el Vendedor no entra a una sección solo-admin", () => {
    renderConApp(<Rutas />, { ruta: "/admin/usuarios", usuario: USUARIOS_PRUEBA.vendedor });
    expect(screen.getByText(/DENEGADO/)).toBeTruthy();
  });

  it("el Administrador entra a la sección solo-admin", () => {
    renderConApp(<Rutas />, { ruta: "/admin/usuarios", usuario: USUARIOS_PRUEBA.admin });
    expect(screen.getByText("USUARIOS")).toBeTruthy();
  });
});
