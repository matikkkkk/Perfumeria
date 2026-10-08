import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";

// Marco de todas las páginas públicas: navbar arriba, footer abajo y la página en medio.
// El fondo (luxury-bg) está en <body> (index.html), igual que en el HTML original.
export default function LayoutTienda() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <header>
        <Navbar />
      </header>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
