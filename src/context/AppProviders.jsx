import { AuthProvider } from "./AuthContext";
import { CarritoProvider } from "./CarritoContext";
import { WishlistProvider } from "./WishlistContext";

// Agrupa los tres contextos para no anidarlos a mano en main.jsx.
// Los tres son independientes entre sí, el orden no importa.
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CarritoProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}
