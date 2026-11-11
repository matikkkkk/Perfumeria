import { lazy, Suspense } from "react";
const GuiaOlfativa = lazy(() => import("../pages/tienda/GuiaOlfativa"));
const PreguntasFrecuentesPage = lazy(() => import("../pages/tienda/PreguntasFrecuentesPage"));
import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "../components/layout/LayoutAdmin";
import LayoutTienda from "../components/layout/LayoutTienda";
import { ROLES_SOLO_ADMIN, ROLES_STAFF } from "../utils/acceso";
import RutaProtegida from "./RutaProtegida";
import Home from "../pages/tienda/Home";
const Productos = lazy(() => import("../pages/tienda/Productos"));
const DetalleProducto = lazy(() => import("../pages/tienda/DetalleProducto"));
const Carrito = lazy(() => import("../pages/tienda/Carrito"));
const Wishlist = lazy(() => import("../pages/tienda/Wishlist"));
const Categorias = lazy(() => import("../pages/tienda/Categorias"));
const CategoriaDetalle = lazy(() => import("../pages/tienda/CategoriaDetalle"));
const Ofertas = lazy(() => import("../pages/tienda/Ofertas"));
const Checkout = lazy(() => import("../pages/tienda/Checkout"));
const PagoCorrecto = lazy(() => import("../pages/tienda/PagoCorrecto"));
const PagoError = lazy(() => import("../pages/tienda/PagoError"));
const Login = lazy(() => import("../pages/tienda/Login"));
const Registro = lazy(() => import("../pages/tienda/Registro"));
const Contacto = lazy(() => import("../pages/tienda/Contacto"));
const Nosotros = lazy(() => import("../pages/tienda/Nosotros"));
const Blogs = lazy(() => import("../pages/tienda/Blogs"));
const DetalleBlog = lazy(() => import("../pages/tienda/DetalleBlog"));
const AccesoDenegado = lazy(() => import("../pages/tienda/AccesoDenegado"));
const CerrarSesion = lazy(() => import("../pages/tienda/CerrarSesion"));
const NoEncontrada = lazy(() => import("../pages/tienda/NoEncontrada"));
const DashboardAdmin = lazy(() => import("../pages/admin/DashboardAdmin"));
const OrdenesAdmin = lazy(() => import("../pages/admin/OrdenesAdmin"));
const BoletaOrden = lazy(() => import("../pages/admin/BoletaOrden"));
const PerfilAdmin = lazy(() => import("../pages/admin/PerfilAdmin"));
const ProductosAdmin = lazy(() => import("../pages/admin/ProductosAdmin"));
const NuevoProducto = lazy(() => import("../pages/admin/NuevoProducto"));
const DetalleProductoAdmin = lazy(() => import("../pages/admin/DetalleProductoAdmin"));
const EditarProducto = lazy(() => import("../pages/admin/EditarProducto"));
const ProductosCriticos = lazy(() => import("../pages/admin/ProductosCriticos"));
const ReportesProductos = lazy(() => import("../pages/admin/ReportesProductos"));
const CategoriasAdmin = lazy(() => import("../pages/admin/CategoriasAdmin"));
const NuevaCategoria = lazy(() => import("../pages/admin/NuevaCategoria"));
const EditarCategoria = lazy(() => import("../pages/admin/EditarCategoria"));
const UsuariosAdmin = lazy(() => import("../pages/admin/UsuariosAdmin"));
const NuevoUsuario = lazy(() => import("../pages/admin/NuevoUsuario"));
const DetalleUsuario = lazy(() => import("../pages/admin/DetalleUsuario"));
const EditarUsuario = lazy(() => import("../pages/admin/EditarUsuario"));
const HistorialCompras = lazy(() => import("../pages/admin/HistorialCompras"));
const ReportesAdmin = lazy(() => import("../pages/admin/ReportesAdmin"));
const TemporadaAdmin = lazy(() => import("../pages/admin/TemporadaAdmin"));
const CuponesAdmin = lazy(() => import("../pages/admin/CuponesAdmin"));
const PanelCliente = lazy(() => import("../pages/tienda/PanelCliente"));

// Mapa de rutas del proyecto (Figura 2 de las instrucciones: tienda + administrador).
// Reglas de acceso:
//   - Tienda: pública, incluido el checkout (el invitado puede comprar; si hay sesión, se autocompletan sus datos).
//   - /admin: Administrador y Vendedor.
//   - Dentro de /admin, categorías, usuarios y crear/editar productos son solo del Administrador
//     (en el HTML el Vendedor tampoco veía Nuevo producto ni Usuarios).
export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="container py-5" role="status">Cargando página…</div>}>
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
        <Route path="guia-olfativa" element={<GuiaOlfativa />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="logout" element={<CerrarSesion />} />
        <Route element={<RutaProtegida roles={["Cliente"]} />}>
          <Route path="mi-cuenta" element={<PanelCliente />} />
          <Route path="mi-cuenta/:seccion" element={<PanelCliente />} />
        </Route>
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
            <Route path="cupones" element={<CuponesAdmin />} />
            <Route path="temporada" element={<TemporadaAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="usuarios/:id" element={<DetalleUsuario />} />
            <Route path="usuarios/:id/editar" element={<EditarUsuario />} />
            <Route path="usuarios/:id/compras" element={<HistorialCompras />} />
          </Route>
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
}
