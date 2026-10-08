import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "../components/layout/LayoutAdmin";
import LayoutTienda from "../components/layout/LayoutTienda";
import { ROLES_SOLO_ADMIN, ROLES_STAFF } from "../utils/acceso";
import RutaProtegida from "./RutaProtegida";
import Home from "../pages/tienda/Home";
import Productos from "../pages/tienda/Productos";
import DetalleProducto from "../pages/tienda/DetalleProducto";
import Carrito from "../pages/tienda/Carrito";
import Wishlist from "../pages/tienda/Wishlist";
import Categorias from "../pages/tienda/Categorias";
import CategoriaDetalle from "../pages/tienda/CategoriaDetalle";
import Ofertas from "../pages/tienda/Ofertas";
import Checkout from "../pages/tienda/Checkout";
import PagoCorrecto from "../pages/tienda/PagoCorrecto";
import PagoError from "../pages/tienda/PagoError";
import Login from "../pages/tienda/Login";
import Registro from "../pages/tienda/Registro";
import Contacto from "../pages/tienda/Contacto";
import Nosotros from "../pages/tienda/Nosotros";
import Blogs from "../pages/tienda/Blogs";
import DetalleBlog from "../pages/tienda/DetalleBlog";
import AccesoDenegado from "../pages/tienda/AccesoDenegado";
import CerrarSesion from "../pages/tienda/CerrarSesion";
import NoEncontrada from "../pages/tienda/NoEncontrada";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import OrdenesAdmin from "../pages/admin/OrdenesAdmin";
import BoletaOrden from "../pages/admin/BoletaOrden";
import PerfilAdmin from "../pages/admin/PerfilAdmin";
import ProductosAdmin from "../pages/admin/ProductosAdmin";
import NuevoProducto from "../pages/admin/NuevoProducto";
import DetalleProductoAdmin from "../pages/admin/DetalleProductoAdmin";
import EditarProducto from "../pages/admin/EditarProducto";
import ProductosCriticos from "../pages/admin/ProductosCriticos";
import ReportesProductos from "../pages/admin/ReportesProductos";
import CategoriasAdmin from "../pages/admin/CategoriasAdmin";
import NuevaCategoria from "../pages/admin/NuevaCategoria";
import EditarCategoria from "../pages/admin/EditarCategoria";
import UsuariosAdmin from "../pages/admin/UsuariosAdmin";
import NuevoUsuario from "../pages/admin/NuevoUsuario";
import DetalleUsuario from "../pages/admin/DetalleUsuario";
import EditarUsuario from "../pages/admin/EditarUsuario";
import HistorialCompras from "../pages/admin/HistorialCompras";
import ReportesAdmin from "../pages/admin/ReportesAdmin";

// Mapa de rutas del proyecto (Figura 2 de las instrucciones: tienda + administrador).
// Reglas de acceso:
//   - Tienda: pública, incluido el checkout (el invitado puede comprar; si hay sesión, se autocompletan sus datos).
//   - /admin: Administrador y Vendedor.
//   - Dentro de /admin, categorías, usuarios y crear/editar productos son solo del Administrador
//     (en el HTML el Vendedor tampoco veía Nuevo producto ni Usuarios).
export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Tienda ---------- */}
      <Route element={<LayoutTienda />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<CategoriaDetalle />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago-correcto/:ordenId" element={<PagoCorrecto />} />
        <Route path="pago-error/:ordenId" element={<PagoError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="logout" element={<CerrarSesion />} />
        <Route path="acceso-denegado" element={<AccesoDenegado />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* ---------- Administrador / Vendedor ---------- */}
      <Route path="admin" element={<RutaProtegida roles={ROLES_STAFF} />}>
        <Route element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="ordenes" element={<OrdenesAdmin />} />
          <Route path="ordenes/:id" element={<BoletaOrden />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/criticos" element={<ProductosCriticos />} />
          <Route path="productos/reportes" element={<ReportesProductos />} />
          <Route path="productos/:id" element={<DetalleProductoAdmin />} />
          <Route path="reportes" element={<ReportesAdmin />} />
          <Route path="perfil" element={<PerfilAdmin />} />

          {/* Solo Administrador */}
          <Route element={<RutaProtegida roles={ROLES_SOLO_ADMIN} />}>
            <Route path="productos/nuevo" element={<NuevoProducto />} />
            <Route path="productos/:id/editar" element={<EditarProducto />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="categorias/nueva" element={<NuevaCategoria />} />
            <Route path="categorias/:id/editar" element={<EditarCategoria />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="usuarios/:id" element={<DetalleUsuario />} />
            <Route path="usuarios/:id/editar" element={<EditarUsuario />} />
            <Route path="usuarios/:id/compras" element={<HistorialCompras />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
