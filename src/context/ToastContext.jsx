import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);
const DURACION_MS = 3000; // igual que mostrarToast() del HTML

// Avisos flotantes abajo a la derecha (reemplaza mostrarToast de script.js).
// Uso: const { mostrarToast } = useToast();  mostrarToast("Producto agregado al carrito.", "aviso")
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const siguienteId = useRef(0);

  const mostrarToast = useCallback((mensaje, tipo = "ok") => {
    const id = (siguienteId.current += 1);
    setToasts((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => setToasts((actuales) => actuales.filter((t) => t.id !== id)), DURACION_MS);
  }, []);

  const valor = useMemo(() => ({ mostrarToast }), [mostrarToast]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`toast-luxury${t.tipo === "aviso" ? " toast-luxury--aviso" : ""}`}>
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return contexto;
}
