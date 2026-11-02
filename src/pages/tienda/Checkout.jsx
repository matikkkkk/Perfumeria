import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { ordenesService } from "../../services/ordenesService";
import { productosService } from "../../services/productosService";
import { formatearPrecio } from "../../utils/formato";
import { regiones } from "../../data/regiones";
import { formatearTarjeta, formatearVencimiento, vencimientoValido } from "../../utils/tarjetaDemo";

function validarCompra(d, comunas) {
  const errores = {};
  const requeridos = { nombre: "Ingresa tu nombre.", apellidos: "Ingresa tus apellidos.", correo: "Ingresa tu correo electrónico.", calle: "Ingresa la calle y el número.", region: "Selecciona una región.", comuna: "Selecciona una comuna.", titular: "Ingresa el nombre del titular." };
  Object.entries(requeridos).forEach(([campo, mensaje]) => { if (!d[campo]?.trim()) errores[campo] = mensaje; });
  if (d.nombre.trim().length > 0 && d.nombre.trim().length < 2) errores.nombre = "El nombre debe tener al menos 2 caracteres.";
  if (d.apellidos.trim().length > 0 && d.apellidos.trim().length < 2) errores.apellidos = "Los apellidos deben tener al menos 2 caracteres.";
  if (d.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) errores.correo = "Ingresa un correo electrónico válido.";
  if (d.calle.trim() && d.calle.trim().length < 5) errores.calle = "Ingresa una dirección completa (mínimo 5 caracteres).";
  if (d.region && !regiones.some(r => r.nombre === d.region)) errores.region = "Selecciona una región válida.";
  if (d.comuna && !comunas.includes(d.comuna)) errores.comuna = "Selecciona una comuna válida para la región.";
  if (d.titular.trim() && d.titular.trim().length < 2) errores.titular = "Ingresa el nombre completo del titular.";
  if (!/^\d{13,19}$/.test(d.tarjeta.replace(/\s/g, ""))) errores.tarjeta = "Ingresa un número de tarjeta válido (13 a 19 dígitos).";
  if (!vencimientoValido(d.vencimiento)) errores.vencimiento = "Ingresa una fecha de vencimiento válida (MM/AA).";
  if (!/^\d{3,4}$/.test(d.cvv)) errores.cvv = "Ingresa un CVV de 3 o 4 dígitos.";
  return errores;
}

const inicial = { nombre: "", apellidos: "", correo: "", calle: "", departamento: "", region: "", comuna: "", indicaciones: "", titular: "", tarjeta: "", vencimiento: "", cvv: "" };


export default function Checkout() {
  const { items, subtotal, cupon, descuento, total, vaciar, aplicarCupon, quitarCupon, sincronizarCatalogo } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(() => ({ ...inicial, nombre: usuario?.nombre || "", apellidos: usuario?.apellidos || "", correo: usuario?.correo || "" }));
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [codigoCupon, setCodigoCupon] = useState("");
  const [mensajeCupon, setMensajeCupon] = useState(null);
  const [validandoCupon, setValidandoCupon] = useState(false);

  async function aplicarCuponPago() {
    if (cupon || validandoCupon || procesando) return;
    setValidandoCupon(true);
    try {
      const resultado = await aplicarCupon(codigoCupon);
      setMensajeCupon({ ok: resultado.ok, texto: resultado.mensaje });
      if (resultado.ok) setCodigoCupon("");
    } finally {
      setValidandoCupon(false);
    }
  }

  function quitarCuponPago() {
    quitarCupon();
    setCodigoCupon("");
    setMensajeCupon(null);
  }
  const comunasDisponibles = regiones.find((r) => r.nombre === datos.region)?.comunas ?? [];
  const cambio = (e) => {
    const { name, value } = e.target;
    const ajustado = name === "tarjeta" ? formatearTarjeta(value)
      : name === "vencimiento" ? formatearVencimiento(value)
      : name === "cvv" ? value.replace(/\D/g, "").slice(0, 4)
      : value;
    setDatos((actual) => ({ ...actual, [name]: ajustado, ...(name === "region" ? { comuna: "" } : {}) }));
    setErrores((prev) => {
      if (!prev[name] && !(name === "region" && prev.comuna)) return prev;
      const siguientes = { ...prev };
      delete siguientes[name];
      if (name === "region") delete siguientes.comuna;
      return siguientes;
    });
  };

  async function pagar(e) {
    e.preventDefault(); setError("");
    if (!items.length) { setError("Tu carrito está vacío. Agrega una fragancia antes de continuar."); return; }
    const nuevosErrores = validarCompra(datos, comunasDisponibles);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) {
      document.getElementById(Object.keys(nuevosErrores)[0])?.focus();
      return;
    }
    setProcesando(true);
    try {
      // Consultar catálogo justo antes de confirmar, nunca confiar en localStorage.
      const actuales = await Promise.all(items.map((i) => productosService.obtener(i.productoId)));
      const cambioPrecio = items.some((i, index) => Number(i.precio) !== Number(actuales[index].precio));
      const agotado = items.find((i, index) => Number(actuales[index].stock) < Number(i.cantidad));
      sincronizarCatalogo(actuales);
      if (agotado) {
        setError(`El stock de ${agotado.nombre} cambió. Revisa las cantidades del carrito antes de pagar.`);
        return;
      }
      if (cambioPrecio) {
        setError("Se actualizaron los precios del catálogo. Revisa el nuevo total y confirma nuevamente tu compra.");
        return;
      }
      // El backend vuelve a comprobar los precios y rechaza cualquier cambio posterior.
    } catch {
      setError("No se pudo actualizar el catálogo. No se registró ningún pago; inténtalo nuevamente.");
      return;
    } finally {
      setProcesando(false);
    }
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
    } catch (err) { setError(err.cuerpo?.mensaje || "No pudimos registrar la orden. Revisa los productos y vuelve a intentarlo."); }
    finally { setProcesando(false); }
  }

  const campoError = (name) => errores[name] ? <div className="invalid-feedback d-block" id={`${name}-error`} role="alert">{errores[name]}</div> : null;
  const claseCampo = (name, base = "form-control") => `${base}${errores[name] ? " is-invalid" : ""}`;
  const propsError = (name) => ({ "aria-invalid": Boolean(errores[name]), "aria-describedby": errores[name] ? `${name}-error` : undefined });

  if (!items.length) return <div className="container py-5 text-center"><h1 className="luxury-title">Tu carrito está vacío</h1><p>Agrega tus fragancias antes de ir al pago.</p><Link className="btn btn-luxury" to="/productos">Volver a la tienda</Link></div>;
  return <div className="container py-5"><div className="text-center mb-5"><span className="text-gold tracking-widest text-uppercase">Último paso</span><h1 className="luxury-title display-5 mt-2">Finalizar compra</h1><div className="gold-divider mx-auto my-3"/><p className="text-gold-light">Completa tus datos de envío y pago de forma segura.</p></div>
    <form onSubmit={pagar} noValidate><div className="row g-4"><div className="col-lg-7"><section className="luxury-card p-4 mb-4"><h2 className="h4 luxury-title mb-4">1. Datos del cliente</h2><div className="row g-3">{[["nombre","Nombre"],["apellidos","Apellidos"],["correo","Correo electrónico"]].map(([name,label])=><div className="col-md-6" key={name}><label className="form-label" htmlFor={name}>{label}</label><input className={claseCampo(name)} id={name} name={name} {...propsError(name)} value={datos[name]} onChange={cambio} required type={name === "correo" ? "email" : "text"}/>{campoError(name)}</div>)}</div></section>
      <section className="luxury-card p-4 mb-4"><h2 className="h4 luxury-title mb-4">2. Dirección de envío</h2><div className="row g-3"><div className="col-md-8"><label className="form-label" htmlFor="calle">Calle y número</label><input className={claseCampo("calle")} id="calle" name="calle" {...propsError("calle")} value={datos.calle} onChange={cambio} required/>{campoError("calle")}</div><div className="col-md-4"><label className="form-label" htmlFor="departamento">Depto. (opcional)</label><input className={claseCampo("departamento")} id="departamento" name="departamento" {...propsError("departamento")} value={datos.departamento} onChange={cambio}/></div><div className="col-md-6"><label className="form-label" htmlFor="region">Región</label><select className={claseCampo("region", "form-select")} id="region" name="region" {...propsError("region")} value={datos.region} onChange={cambio} required><option value="">Selecciona región</option>{regiones.map(r=><option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</select>{campoError("region")}</div><div className="col-md-6"><label className="form-label" htmlFor="comuna">Comuna</label><select className={claseCampo("comuna", "form-select")} id="comuna" name="comuna" {...propsError("comuna")} value={datos.comuna} onChange={cambio} disabled={!datos.region} required><option value="">{datos.region ? "Selecciona comuna" : "Primero selecciona región"}</option>{comunasDisponibles.map(c=><option key={c} value={c}>{c}</option>)}</select>{campoError("comuna")}</div><div className="col-12"><label className="form-label" htmlFor="indicaciones">Indicaciones (opcional)</label><textarea className="form-control" id="indicaciones" name="indicaciones" rows="2" value={datos.indicaciones} onChange={cambio}/></div></div></section>
      <section className="luxury-card p-4"><h2 className="h4 luxury-title mb-4">3. Pago con tarjeta</h2><div className="row g-3"><div className="col-12"><label className="form-label" htmlFor="titular">Nombre del titular</label><input className={claseCampo("titular")} id="titular" name="titular" {...propsError("titular")} value={datos.titular} onChange={cambio} required/>{campoError("titular")}</div><div className="col-12"><label className="form-label" htmlFor="tarjeta">Número de tarjeta</label><input className={claseCampo("tarjeta")} id="tarjeta" name="tarjeta" {...propsError("tarjeta")} inputMode="numeric" autoComplete="cc-number" maxLength="23" placeholder="1234 5678 9012 3456" value={datos.tarjeta} onChange={cambio} required/>{campoError("tarjeta")}<small className="text-gold-light">Demo: usa una tarjeta de prueba; para simular rechazo, termina en 0000.</small></div><div className="col-md-6"><label className="form-label" htmlFor="vencimiento">Vencimiento (MM/AA)</label><input className={claseCampo("vencimiento")} id="vencimiento" name="vencimiento" {...propsError("vencimiento")} inputMode="numeric" autoComplete="cc-exp" maxLength="5" placeholder="MM/AA" value={datos.vencimiento} onChange={cambio} required/>{campoError("vencimiento")}</div><div className="col-md-6"><label className="form-label" htmlFor="cvv">CVV</label><input className={claseCampo("cvv")} id="cvv" name="cvv" {...propsError("cvv")} type="password" inputMode="numeric" autoComplete="cc-csc" maxLength="4" value={datos.cvv} onChange={cambio} required/>{campoError("cvv")}</div></div></section></div>
      <aside className="col-lg-5"><div className="luxury-card p-4 position-sticky" style={{top:"100px"}}><h2 className="h4 luxury-title mb-4">Resumen de la orden</h2>{items.map(i=><div key={i.productoId} className="d-flex justify-content-between gap-3 mb-3"><div><div>{i.nombre}</div><small className="text-gold-light">{i.cantidad} × {formatearPrecio(i.precio)}</small></div><span>{formatearPrecio(i.precio*i.cantidad)}</span></div>)}<hr/>
      <div className="mb-3">
        <label className="form-label text-gold-light" htmlFor="cupon-pago">Cupón de descuento</label>
        <div className="input-group">
          <input id="cupon-pago" className="form-control form-luxury" type="text" placeholder="Ej: LUXURY10" value={cupon || codigoCupon} disabled={Boolean(cupon) || procesando || validandoCupon} onChange={(e) => { setCodigoCupon(e.target.value); setMensajeCupon(null); }} />
          {cupon ? <button type="button" className="btn btn-outline-luxury" onClick={quitarCuponPago} disabled={procesando}>Quitar</button>
            : <button type="button" className="btn btn-outline-luxury" onClick={aplicarCuponPago} disabled={procesando || validandoCupon}>{validandoCupon ? "Validando…" : "Aplicar"}</button>}
        </div>
        {cupon && <small className="d-block mt-1 text-success">Cupón {cupon} aplicado. Ya se incluye en el total.</small>}
        {mensajeCupon && !cupon && <small role="status" className={`d-block mt-1 ${mensajeCupon.ok ? "text-success" : "text-danger"}`}>{mensajeCupon.texto}</small>}
      </div>
      <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>{cupon&&<div className="d-flex justify-content-between mb-2"><span>Descuento ({cupon})</span><span>-{formatearPrecio(descuento)}</span></div>}<div className="d-flex justify-content-between fw-bold fs-5 text-gold mt-3"><span>Total</span><span>{formatearPrecio(total)}</span></div>{error&&<div role="alert" className="alert alert-danger mt-3">{error}</div>}<button className="btn btn-luxury w-100 mt-4" type="submit" disabled={procesando}>{procesando?"Procesando…":"Confirmar y pagar"}</button><Link className="btn btn-outline-secondary w-100 mt-2" to="/carrito">Volver al carrito</Link><small className="d-block text-gold-light mt-3">Esta tienda usa un flujo de pago simulado para fines académicos. No ingreses datos de una tarjeta real.</small></div></aside></div></form></div>;
}
