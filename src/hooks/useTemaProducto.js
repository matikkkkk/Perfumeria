import { useEffect } from "react";
import { familiaTemaDeProducto, navClaroDe, temaDeProducto } from "../utils/productoDetalle";
import { paletaLegible } from "../utils/contrasteTema";

// El tema afecta solo a la pantalla del perfume y se restaura al navegar.
// Los colores decorativos se conservan; los de lectura se calculan por contraste.
export function useTemaProducto(producto) {
  useEffect(() => {
    if (!producto) return undefined;

    const body = document.body;
    const tema = temaDeProducto(producto);
    const familia = familiaTemaDeProducto(producto, tema);
    const clases = [`tema-${tema}`, `detalle-familia-${familia}`, "detalle-tema-adaptativo"];
    if (navClaroDe(producto, tema)) clases.push("nav-claro");

    const estilosPrevios = new Map();
    const establecer = (variable, valor) => {
      if (!estilosPrevios.has(variable)) {
        estilosPrevios.set(variable, {
          valor: body.style.getPropertyValue(variable),
          prioridad: body.style.getPropertyPriority(variable),
        });
      }
      body.style.setProperty(variable, valor);
    };

    body.classList.add(...clases);
    Object.entries(producto.colores ?? {}).forEach(([clave, valor]) => {
      // Solo variables de tema; las propiedades CSS del documento no cambian.
      if (/^tema-[a-z-]+$/.test(clave) && typeof valor === "string") {
        establecer(`--${clave}`, valor);
      }
    });

    const estilos = getComputedStyle(body);
    const paleta = paletaLegible((variable) => estilos.getPropertyValue(variable));
    Object.entries(paleta).forEach(([variable, valor]) => establecer(variable, valor));

    return () => {
      body.classList.remove(...clases);
      estilosPrevios.forEach(({ valor, prioridad }, variable) => {
        if (valor) body.style.setProperty(variable, valor, prioridad);
        else body.style.removeProperty(variable);
      });
    };
  }, [producto]);
}
