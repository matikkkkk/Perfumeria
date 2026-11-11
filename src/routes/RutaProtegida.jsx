import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { evaluarAcceso } from "../utils/acceso";

// Protege rutas por sesión y rol. Dos formas de usarla:
//   <Route element={<RutaProtegida roles={ROLES_STAFF} />}> ...rutas hijas... </Route>   (como layout)
//   <RutaProtegida roles={["Administrador"]}><Pagina /></RutaProtegida>                  (envolviendo)
// Sin `roles` solo exige haber iniciado sesión.
//
// La decisión vive en utils/acceso.js (evaluarAcceso); este componente solo redirige.
// `state.desde` guarda la ruta que se quiso abrir: el Login (etapa 10) puede devolver al usuario ahí.
export default function RutaProtegida({ roles = [], children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  const acceso = evaluarAcceso(usuario, roles);

  if (acceso === "login") {
    return <Navigate to="/login" replace state={{ desde: location.pathname + location.search }} />;
  }
  if (acceso === "denegado") {
    return <Navigate to="/acceso-denegado" replace state={{ desde: location.pathname }} />;
  }
  return children ?? <Outlet />;
}
