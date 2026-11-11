import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const mover = () => {
      const destino = document.getElementById(id);
      if (destino) destino.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    };
    const frame = window.requestAnimationFrame(mover);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
