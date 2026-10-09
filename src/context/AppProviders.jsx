import { AuthProvider } from "./AuthContext";
import { CarritoProvider } from "./CarritoContext";
import { ToastProvider } from "./ToastContext";
import { WishlistProvider } from "./WishlistContext";

// Agrupa los contextos para no anidarlos a mano en main.jsx.
// Son independientes entre sí, el orden no importa.
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CarritoProvider>
        <WishlistProvider>
          <ToastProvider>{children}</ToastProvider>
        </WishlistProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}
