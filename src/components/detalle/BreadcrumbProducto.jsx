import { Link } from "react-router-dom";

export default function BreadcrumbProducto({ nombre }) {
  return (
    <div className="container pt-4 pb-2">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb-luxury">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li className="active" aria-current="page">{nombre}</li>
        </ol>
      </nav>
    </div>
  );
}
