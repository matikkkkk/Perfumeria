import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorAuth } from "../../services/usuariosService";
import { reglasCampos } from "../../utils/validaciones";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [datos, setDatos] = useState({ correo: "", password: "" });
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  function validarCampo(nombre, siguiente = datos) {
    const regla = reglasCampos[nombre];
    return regla ? regla(String(siguiente[nombre] ?? ""), siguiente) : "";
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    const siguiente = { ...datos, [name]: value };
    setDatos(siguiente);
    if (tocados[name]) {
      setErrores((previo) => ({ ...previo, [name]: validarCampo(name, siguiente) }));
    }
  }

  function marcarTocado(evento) {
    const { name } = evento.target;
    setTocados((previo) => ({ ...previo, [name]: true }));
    setErrores((previo) => ({ ...previo, [name]: validarCampo(name) }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setMensajeGeneral("");

    const nuevosErrores = {
      correo: validarCampo("correo"),
      password: validarCampo("password"),
    };

    Object.keys(nuevosErrores).forEach((clave) => {
      if (!nuevosErrores[clave]) delete nuevosErrores[clave];
    });

    setErrores(nuevosErrores);
    setTocados({ correo: true, password: true });
    if (Object.keys(nuevosErrores).length) return;

    setCargando(true);
    try {
      const usuario = await iniciarSesion(datos.correo, datos.password);
      const destino = location.state?.from?.pathname || (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor" ? "/admin" : "/");
      navigate(destino, { replace: true });
    } catch (err) {
      if (err instanceof ErrorAuth && err.campo) {
        setErrores((previo) => ({ ...previo, [err.campo]: err.message }));
        setTocados((previo) => ({ ...previo, [err.campo]: true }));
      } else {
        setMensajeGeneral(err?.message || "No fue posible iniciar sesión. Revisa tus datos e inténtalo nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="container py-5 my-4" style={{ maxWidth: 760 }}>
      <div className="text-center mb-5 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">Bienvenido de vuelta</span>
        <h1 className="display-5 luxury-title mt-2">Iniciar sesión</h1>
        <div className="gold-divider mx-auto my-3"></div>
        <p className="text-gold-light fw-light">Ingresa a tu cuenta Luxury para continuar tu experiencia.</p>
      </div>

      <div className="card luxury-card p-4 p-md-5 auth-card">
        <form className="luxury-form" onSubmit={enviar} noValidate>
          <div className="mb-3">
            <label className="form-label form-label-luxury" htmlFor="login-correo">Correo electrónico</label>
            <input
              id="login-correo"
              className={`form-control form-luxury ${tocados.correo && errores.correo ? "is-invalid" : ""}`}
              name="correo"
              type="email"
              autoComplete="email"
              required
              value={datos.correo}
              onChange={cambiar}
              onBlur={marcarTocado}
              placeholder="tu@correo.com"
            />
            {tocados.correo && errores.correo && <div className="error d-block">{errores.correo}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label form-label-luxury" htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              className={`form-control form-luxury ${tocados.password && errores.password ? "is-invalid" : ""}`}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={datos.password}
              onChange={cambiar}
              onBlur={marcarTocado}
              placeholder="Ingresa tu contraseña"
            />
            {tocados.password && errores.password && <div className="error d-block">{errores.password}</div>}
          </div>

          {mensajeGeneral && <div className="alert alert-danger" role="alert">{mensajeGeneral}</div>}

          <button className="btn btn-luxury w-100 mt-2" type="submit" disabled={cargando}>
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 auth-helper-text">
          ¿Aún no tienes cuenta? <Link to="/registro" className="text-gold-light">Crear cuenta</Link>
        </p>
      </div>
    </section>
  );
}
