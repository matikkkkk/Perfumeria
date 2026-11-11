import { createContext, useCallback, useContext, useMemo } from "react";
import { useStorage } from "../hooks/useStorage";
import { alternarId } from "../utils/wishlist";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Solo se guardan ids de producto (clave "wishlist", igual que el HTML).
  // Los datos del producto se piden a la API al mostrar la lista, así no quedan desactualizados.
  const [ids, setIds] = useStorage("wishlist", []);

  const alternar = useCallback((id) => setIds((actuales) => alternarId(actuales, id)), [setIds]);
  const quitar = useCallback((id) => setIds((actuales) => actuales.filter((x) => x !== id)), [setIds]);
  const vaciar = useCallback(() => setIds([]), [setIds]);

  const valor = useMemo(
    () => ({
      ids,
      cantidad: ids.length, // número del corazón en el navbar
      estaEnWishlist: (id) => ids.includes(id),
      alternar, // el botón corazón de las tarjetas
      quitar,
      vaciar,
    }),
    [ids, alternar, quitar, vaciar]
  );

  return <WishlistContext.Provider value={valor}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const contexto = useContext(WishlistContext);
  if (!contexto) throw new Error("useWishlist debe usarse dentro de <WishlistProvider>");
  return contexto;
}
