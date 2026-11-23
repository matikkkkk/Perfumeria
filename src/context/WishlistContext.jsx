import { createContext, useCallback, useContext, useMemo } from "react";
import { useStorage } from "../hooks/useStorage";
import { useAuth } from "./AuthContext";
import { alternarId } from "../utils/wishlist";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { usuario } = useAuth();
  const clave = usuario?.id ? `wishlist:usuario:${usuario.id}` : "wishlist:invitado";
  return <WishlistDeCuenta key={clave} clave={clave}>{children}</WishlistDeCuenta>;
}

function WishlistDeCuenta({ children, clave }) {
  // Solo se guardan ids de producto (clave "wishlist", igual que el HTML).
  // Los datos del producto se piden a la API al mostrar la lista, así no quedan desactualizados.
  const [ids, setIds] = useStorage(clave, []);

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
