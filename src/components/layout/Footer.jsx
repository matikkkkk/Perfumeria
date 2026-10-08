import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NewsletterForm from "../NewsletterForm";

export default function Footer() {
  const { estaAutenticado } = useAuth();

  return (
    <footer className="site-footer vh-half">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-5">
            <span className="brand-logo d-block mb-2">LUXURY</span>
            <p className="footer-text">Curaduría de fragancias por estación, pensada para acompañarte todo el año.</p>
          </div>
          <div className="col-6 col-md-3">
            <h4 className="footer-heading">Colecciones</h4>
            <ul className="footer-list">
              <li><Link to="/productos?genero=hombre">Perfumes Hombre</Link></li>
              <li><Link to="/productos?genero=mujer">Perfumes Mujer</Link></li>
              <li><Link to="/productos?genero=unisex">Perfumes Unisex</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h4 className="footer-heading">Sitio</h4>
            <ul className="footer-list">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              {!estaAutenticado && <li><Link to="/login">Ingresar</Link></li>}
            </ul>
          </div>
        </div>
        <div className="row justify-content-center mt-4 pt-4 border-top border-secondary border-opacity-25">
          <div className="col-12 col-md-6 text-center">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="footer-text mb-3">Entérate antes que nadie de nuevos lanzamientos y ediciones limitadas.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="footer-bottom text-center">
          <span>© 2026 Luxury — Proyecto académico Full Stack 2</span>
        </div>
      </div>
    </footer>
  );
}
