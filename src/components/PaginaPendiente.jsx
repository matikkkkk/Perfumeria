import { useLocation, useParams } from "react-router-dom";

// Relleno temporal de las páginas que aún no se construyen. Muestra la ruta y sus parámetros
// para comprobar que el router apunta bien. Cada etapa reemplaza el contenido de su página.
export default function PaginaPendiente({ titulo, etapa, descripcion }) {
  const { pathname } = useLocation();
  const params = useParams();
  const textoParams = Object.entries(params)
    .map(([clave, valor]) => `${clave} = ${valor}`)
    .join(", ");

  return (
    <section className="container py-5">
      <span className="section-label d-block">Se construye en la etapa {etapa}</span>
      <h1 className="luxury-title fst-italic mt-2">{titulo}</h1>
      <div className="gold-divider my-3"></div>
      {descripcion && <p className="text-gold-light">{descripcion}</p>}
      <p className="fs-7 text-secondary mb-0">
        Ruta: <code>{pathname}</code>
        {textoParams && <> · Parámetros: <code>{textoParams}</code></>}
      </p>
    </section>
  );
}
