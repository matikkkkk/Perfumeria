import { Link } from "react-router-dom";
import { PLANES_MONTHLY } from "../../data/planes";
import { formatearPrecio } from "../../utils/formato";

// Suscripción mensual: tres planes fijos que llevan al formulario de contacto.
export default function MaisonMonthly() {
  return (
    <section className="container py-5 vh-section monthly-section">
      <div className="text-center mb-5">
        <span className="text-gold text-uppercase tracking-widest fs-7">Suscripción mensual</span>
        <h2 className="luxury-title fst-italic mt-2">La Maison Monthly</h2>
        <p className="text-gold-light fw-light mx-auto" style={{ maxWidth: 560 }}>
          Recibe fragancias exclusivas en tu puerta cada mes, curadas según tu perfil, con empaque de lujo.
        </p>
      </div>
      <div className="row g-4 justify-content-center">
        {PLANES_MONTHLY.map((plan) => (
          <div key={plan.nombre} className="col-12 col-md-4">
            <div className={`monthly-card${plan.recomendado ? " monthly-card--recomendado" : ""}`}>
              {plan.recomendado && <span className="monthly-badge">Recomendado</span>}
              <span className="monthly-plan-label">Plan</span>
              <h3 className="monthly-plan-name">{plan.nombre}</h3>
              <div className="monthly-price">
                {formatearPrecio(plan.precio)} <small>/ mes</small>
              </div>
              <p className="monthly-includes">{plan.incluye}</p>
              <Link to="/contacto" className="btn btn-luxury btn-luxury--fill w-100">
                Suscribirse
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-gold-light fs-7 mt-4">Cancela cuando quieras · Sin permanencia · Próxima caja el 1 de cada mes</p>
    </section>
  );
}
