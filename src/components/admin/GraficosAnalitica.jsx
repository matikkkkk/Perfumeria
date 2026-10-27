import { useState } from "react";
import { formatearPrecio } from "../../utils/formato";
import { calcularAnalitica } from "../../utils/analitica";

const colores = ["#c8a65a", "#ac8951", "#8a713e", "#dbc18b", "#796c58", "#d0bfa2", "#a2a09a", "#796343"];
function GraficoBarras({ datos, campo, formato = String, titulo }) {
  if (!datos.length) return <p className="text-gold-light mb-0">Aún no hay ventas para mostrar este gráfico.</p>;
  const maximo = Math.max(...datos.map((d) => d[campo]), 1);
  return <div className="lux-chart-bars" role="img" aria-label={titulo}>
    {datos.map((dato) => <div className="lux-chart-bar-item" key={dato.clave || dato.id} title={`${dato.etiqueta || dato.nombre}: ${formato(dato[campo])}`}>
      <span className="lux-chart-bar-number">{formato(dato[campo])}</span>
      <div className="lux-chart-bar-track"><div className="lux-chart-bar-fill" style={{ height: `${Math.max(3, dato[campo] / maximo * 100)}%` }} /></div>
      <small>{dato.etiqueta || dato.nombre}</small>
    </div>)}
  </div>;
}
function Ranking({ datos }) {
  if (!datos.length) return <p className="text-gold-light mb-0">Aún no hay productos vendidos.</p>;
  const maximo = Math.max(...datos.map((d) => d.unidades), 1);
  return <div className="lux-chart-ranking">{datos.map((dato, i) => <div key={dato.id} className="mb-3">
    <div className="d-flex justify-content-between gap-2 small mb-1"><span>{i + 1}. {dato.nombre}</span><strong>{dato.unidades} uds.</strong></div>
    <div className="lux-chart-ranking-track"><div style={{ width: `${dato.unidades / maximo * 100}%` }} /></div>
  </div>)}</div>;
}
function Categorias({ datos }) {
  const total = datos.reduce((n, d) => n + d.ingresos, 0);
  if (!total) return <p className="text-gold-light mb-0">No hay categorías con ventas registradas.</p>;
  let acumulado = 0;
  const sectores = datos.map((d, i) => { const inicio = acumulado; acumulado += d.ingresos / total * 100; return `${colores[i % colores.length]} ${inicio}% ${acumulado}%`; });
  return <div className="lux-chart-category">
    <div className="lux-chart-donut" style={{ background: `conic-gradient(${sectores.join(",")})` }} role="img" aria-label="Participación de ingresos por categoría"><div><strong>{datos.length}</strong><small>categorías</small></div></div>
    <div className="lux-chart-legend">{datos.map((d, i) => <div key={d.nombre} className="d-flex align-items-center gap-2 small mb-2"><span className="lux-chart-dot" style={{ background: colores[i % colores.length] }} /><span className="flex-grow-1">{d.nombre}</span><strong>{(d.ingresos / total * 100).toFixed(1)}%</strong></div>)}</div>
  </div>;
}
export default function GraficosAnalitica({ ordenes = [], productos = [] }) {
  const [metrica, setMetrica] = useState("ingresos");
  const info = calcularAnalitica(ordenes, productos);
  return <div className="row g-4 mt-1">
    <div className="col-12 col-xl-7"><section className="admin-panel h-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><h2 className="h4 luxury-title mb-0">Evolución mensual</h2><div className="btn-group btn-group-sm" role="group" aria-label="Métrica mensual"><button type="button" className={`btn ${metrica === "ingresos" ? "btn-warning" : "btn-outline-light"}`} onClick={() => setMetrica("ingresos")}>Ingresos</button><button type="button" className={`btn ${metrica === "pedidos" ? "btn-warning" : "btn-outline-light"}`} onClick={() => setMetrica("pedidos")}>Pedidos</button></div></div>
      <GraficoBarras datos={info.meses} campo={metrica} formato={metrica === "ingresos" ? formatearPrecio : String} titulo={`Evolución mensual de ${metrica}`} />
    </section></div>
    <div className="col-12 col-xl-5"><section className="admin-panel h-100"><h2 className="h4 luxury-title mb-3">Perfumes más vendidos</h2><Ranking datos={info.ranking} /></section></div>
    <div className="col-12 col-xl-7"><section className="admin-panel h-100"><h2 className="h4 luxury-title mb-3">Ingresos por categoría</h2><Categorias datos={info.categorias} /></section></div>
    <div className="col-12 col-xl-5"><section className="admin-panel h-100"><h2 className="h4 luxury-title mb-3">Estado de inventario</h2><div className="lux-inventory-stats">{[["Disponibles",info.inventario.disponibles,"bi-check-circle"],["Stock crítico",info.inventario.criticos,"bi-exclamation-triangle"],["Agotados",info.inventario.agotados,"bi-x-circle"]].map(([nombre, valor, icono]) => <div className="lux-inventory-stat" key={nombre}><i className={`bi ${icono}`} /><strong>{valor}</strong><span>{nombre}</span></div>)}</div><p className="text-gold-light small mb-0 mt-3">Cantidad de productos según sus existencias actuales.</p></section></div>
  </div>;
}
