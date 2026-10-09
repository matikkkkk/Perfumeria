import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { ordenesService } from "../../services/ordenesService";
import { formatearPrecio } from "../../utils/formato";

const inicial = { nombre: "", apellidos: "", correo: "", calle: "", departamento: "", region: "", comuna: "", indicaciones: "", titular: "", tarjeta: "", vencimiento: "", cvv: "" };
const regiones = ["Región Metropolitana", "Valparaíso", "Biobío", "La Araucanía", "Coquimbo", "Los Lagos", "O'Higgins", "Maule", "Antofagasta"];

export default function Checkout() {
  const { items, subtotal, cupon, descuento, total, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(() => ({ ...inicial, nombre: usuario?.nombre || "", apellidos: usuario?.apellidos || "", correo: usuario?.correo || "" }));
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const cambio = (e) => setDatos((actual) => ({ ...actual, [e.target.name]: e.target.value }));

  async function pagar(e) {
    e.preventDefault(); setError("");
    if (!items.length) { setError("Tu carrito está vacío. Agrega una fragancia antes de continuar."); return; }
    if (!/^\d{13,19}$/.test(datos.tarjeta.replace(/\s/g, ""))) { setError("Ingresa un número de tarjeta válido (13 a 19 dígitos)."); return; }
    if (!/^\d{2}\/\d{2}$/.test(datos.vencimiento) || !/^\d{3,4}$/.test(datos.cvv)) { setError("Revisa la fecha de vencimiento y el CVV."); return; }
    setProcesando(true);
    const tarjetaFinal = datos.tarjeta.replace(/\s/g, "").slice(-4);
    const orden = {
      fecha: new Date().toISOString(), estado: tarjetaFinal === "0000" ? "Pago fallido" : "Pagado",
      cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim() },
      envio: { calle: datos.calle.trim(), departamento: datos.departamento.trim(), region: datos.region, comuna: datos.comuna.trim(), indicaciones: datos.indicaciones.trim() },
      items: items.map((i) => ({ productoId: String(i.productoId), codigo: i.codigo, nombre: i.nombre, marca: i.marca, imagen: i.imagen, precio: Number(i.precio), cantidad: Number(i.cantidad), subtotal: Number(i.precio) * Number(i.cantidad) })),
      subtotal, cupon: cupon || null, descuento, total: tarjetaFinal === "0000" ? 0 : total,
      pago: { metodo: "Tarjeta", tarjetaFinal },
      ...(usuario?.id ? { usuarioId: usuario.id } : {}),
    };
    try {
      const guardada = await ordenesService.crear(orden);
      if (orden.estado === "Pagado") { vaciar(); navigate(`/pago-correcto/${guardada.id}`, { state: { orden: { ...orden, id: guardada.id } } }); }
      else navigate(`/pago-error/${guardada.id}`, { state: { orden: { ...orden, id: guardada.id } } });
    } catch (err) { setError("No pudimos registrar la orden. Comprueba que el servicio de la API esté funcionando e inténtalo otra vez."); }
    finally { setProcesando(false); }
  }

  if (!items.length) return <div className="container py-5 text-center"><h1 className="luxury-title">Tu carrito está vacío</h1><p>Agrega tus fragancias antes de ir al pago.</p><Link className="btn btn-luxury" to="/productos">Volver a la tienda</Link></div>;
  return <div className="container py-5"><div className="text-center mb-5"><span className="text-gold tracking-widest text-uppercase">Último paso</span><h1 className="luxury-title display-5 mt-2">Finalizar compra</h1><div className="gold-divider mx-auto my-3"/><p className="text-gold-light">Completa tus datos de envío y pago de forma segura.</p></div>
    <form onSubmit={pagar} noValidate><div className="row g-4"><div className="col-lg-7"><section className="luxury-card p-4 mb-4"><h2 className="h4 luxury-title mb-4">1. Datos del cliente</h2><div className="row g-3">{[["nombre","Nombre"],["apellidos","Apellidos"],["correo","Correo electrónico"]].map(([name,label])=><div className="col-md-6" key={name}><label className="form-label" htmlFor={name}>{label}</label><input className="form-control" id={name} name={name} value={datos[name]} onChange={cambio} required type={name === "correo" ? "email" : "text"}/></div>)}</div></section>
      <section className="luxury-card p-4 mb-4"><h2 className="h4 luxury-title mb-4">2. Dirección de envío</h2><div className="row g-3"><div className="col-md-8"><label className="form-label" htmlFor="calle">Calle y número</label><input className="form-control" id="calle" name="calle" value={datos.calle} onChange={cambio} required/></div><div className="col-md-4"><label className="form-label" htmlFor="departamento">Depto. (opcional)</label><input className="form-control" id="departamento" name="departamento" value={datos.departamento} onChange={cambio}/></div><div className="col-md-6"><label className="form-label" htmlFor="region">Región</label><select className="form-select" id="region" name="region" value={datos.region} onChange={cambio} required><option value="">Selecciona región</option>{regiones.map(r=><option key={r}>{r}</option>)}</select></div><div className="col-md-6"><label className="form-label" htmlFor="comuna">Comuna</label><input className="form-control" id="comuna" name="comuna" value={datos.comuna} onChange={cambio} required/></div><div className="col-12"><label className="form-label" htmlFor="indicaciones">Indicaciones (opcional)</label><textarea className="form-control" id="indicaciones" name="indicaciones" rows="2" value={datos.indicaciones} onChange={cambio}/></div></div></section>
      <section className="luxury-card p-4"><h2 className="h4 luxury-title mb-4">3. Pago con tarjeta</h2><div className="row g-3"><div className="col-12"><label className="form-label" htmlFor="titular">Nombre del titular</label><input className="form-control" id="titular" name="titular" value={datos.titular} onChange={cambio} required/></div><div className="col-12"><label className="form-label" htmlFor="tarjeta">Número de tarjeta</label><input className="form-control" id="tarjeta" name="tarjeta" inputMode="numeric" autoComplete="cc-number" maxLength="23" placeholder="1234 5678 9012 3456" value={datos.tarjeta} onChange={cambio} required/><small className="text-gold-light">Demo: usa una tarjeta de prueba; para simular rechazo, termina en 0000.</small></div><div className="col-md-6"><label className="form-label" htmlFor="vencimiento">Vencimiento (MM/AA)</label><input className="form-control" id="vencimiento" name="vencimiento" placeholder="12/28" value={datos.vencimiento} onChange={cambio} required/></div><div className="col-md-6"><label className="form-label" htmlFor="cvv">CVV</label><input className="form-control" id="cvv" name="cvv" inputMode="numeric" maxLength="4" value={datos.cvv} onChange={cambio} required/></div></div></section></div>
      <aside className="col-lg-5"><div className="luxury-card p-4 position-sticky" style={{top:"100px"}}><h2 className="h4 luxury-title mb-4">Resumen de la orden</h2>{items.map(i=><div key={i.productoId} className="d-flex justify-content-between gap-3 mb-3"><div><div>{i.nombre}</div><small className="text-gold-light">{i.cantidad} × {formatearPrecio(i.precio)}</small></div><span>{formatearPrecio(i.precio*i.cantidad)}</span></div>)}<hr/><div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>{cupon&&<div className="d-flex justify-content-between mb-2"><span>Descuento ({cupon})</span><span>-{formatearPrecio(descuento)}</span></div>}<div className="d-flex justify-content-between fw-bold fs-5 text-gold mt-3"><span>Total</span><span>{formatearPrecio(total)}</span></div>{error&&<div role="alert" className="alert alert-danger mt-3">{error}</div>}<button className="btn btn-luxury w-100 mt-4" type="submit" disabled={procesando}>{procesando?"Procesando…":"Confirmar y pagar"}</button><Link className="btn btn-outline-secondary w-100 mt-2" to="/carrito">Volver al carrito</Link><small className="d-block text-gold-light mt-3">Esta tienda usa un flujo de pago simulado para fines académicos. No ingreses datos de una tarjeta real.</small></div></aside></div></form></div>;
}
