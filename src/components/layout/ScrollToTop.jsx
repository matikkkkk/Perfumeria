import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// El navegador no vuelve arriba al cambiar de ruta en una SPA: lo hacemos nosotros.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
