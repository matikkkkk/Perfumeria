import { useEffect } from "react";
import { navClaroDe, temaDeProducto } from "../utils/productoDetalle";

// El tema del detalle vive en el <body> (clases tema-*, nav-claro y variables --tema-*), porque el CSS lo lee desde ahí
// y el navbar también cambia. En una SPA hay que deshacerlo al salir, si no el tema se quedaría pegado en las demás páginas.
export function useTemaProducto(producto) {
  useEffect(() => {
    if (!producto) return undefined;
    const body = document.body;
    const tema = temaDeProducto(producto);
    const clases = [`tema-${tema}`];
    if (navClaroDe(producto, tema)) clases.push("nav-claro");
    const variables = Object.keys(producto.colores ?? {});

    body.classList.add(...clases);
    variables.forEach((clave) => body.style.setProperty(`--${clave}`, producto.colores[clave]));

    return () => {
      body.classList.remove(...clases);
      variables.forEach((clave) => body.style.removeProperty(`--${clave}`));
    };
  }, [producto]);
}
