import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useStorage } from "../hooks/useStorage";
import { agregarItem, cambiarCantidadItem, cantidadTotal, quitarItem, subtotalItems } from "../utils/carrito";
import { normalizarCodigo } from "../utils/cupones";
import { cuponesService } from "../services/cuponesService";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  // Mismas claves que el HTML: "carrito" y "cuponAplicado".
  const [items, setItems] = useStorage("carrito", []);
  const [cupon, setCupon] = useStorage("cuponAplicado", null);
  const [porcentaje, setPorcentaje] = useState(0);
  useEffect(() => {
    let activo = true;
    if (!cupon) { setPorcentaje(0); return; }
    cuponesService.validar(cupon).then((dato) => { if (activo) setPorcentaje(dato.descuento); })
      .catch(() => { if (activo) { setPorcentaje(0); setCupon(null); } });
    return () => { activo = false; };
  }, [cupon, setCupon]);

  // Devuelve el resultado de agregarItem para que la pantalla decida el aviso:
  //   { ok:false, motivo:"sin_stock" } -> alert/toast de error
  //   { ok:true, critico:true }        -> toast "Quedan pocas unidades"
  const agregar = useCallback(
    (producto, cantidad = 1) => {
      const { items: nuevos, resultado } = agregarItem(items, producto, cantidad);
      if (resultado.ok) setItems(nuevos);
      return resultado;
    },
    [items, setItems]
  );

  const cambiarCantidad = useCallback(
    (productoId, cambio) => {
      const { items: nuevos, ok, motivo } = cambiarCantidadItem(items, productoId, cambio);
      if (ok) setItems(nuevos);
      return { ok, motivo };
    },
    [items, setItems]
  );

  const quitar = useCallback((productoId) => setItems((actuales) => quitarItem(actuales, productoId)), [setItems]);

  // Se usa tras pagar: deja el carrito y el cupón en blanco.
  const vaciar = useCallback(() => {
    setItems([]);
    setCupon(null);
  }, [setItems, setCupon]);

  const aplicarCupon = useCallback(async (codigo) => {
    const limpio = normalizarCodigo(codigo);
    if (!limpio) return { ok: false, mensaje: "Ingresa un código de cupón." };
    try {
      const dato = await cuponesService.validar(limpio);
      setPorcentaje(dato.descuento);
      setCupon(limpio);
      return { ok: true, mensaje: `Cupón aplicado: ${dato.descuento}% de descuento.`, porcentaje: dato.descuento };
    } catch {
      setPorcentaje(0); setCupon(null);
      return { ok: false, mensaje: "Cupón inválido, inactivo o vencido." };
    }
  }, [setCupon]);

  const quitarCupon = useCallback(() => { setCupon(null); setPorcentaje(0); }, [setCupon]);

  const valor = useMemo(() => {
    const subtotal = subtotalItems(items);
    // Si el cupón guardado ya no existe (cambió la lista de cupones), no descuenta nada.
    const descuento = cupon ? Math.round(subtotal * porcentaje / 100) : 0;
    const total = subtotal - descuento;
    return {
      items,
      cantidad: cantidadTotal(items), // unidades totales: el número del ícono del carrito en el navbar
      subtotal,
      cupon,
      descuento,
      total,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      aplicarCupon,
      quitarCupon,
    };
  }, [items, cupon, porcentaje, agregar, cambiarCantidad, quitar, vaciar, aplicarCupon, quitarCupon]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return contexto;
}
