import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorAuth } from "../../services/usuariosService";
import { reglasCampos } from "../../utils/validaciones";

export default function Login() {
  const { iniciarSesion, iniciarSesionGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [googlePendiente, setGooglePendiente] = useState(null);
  const [perfilGoogle, setPerfilGoogle] = useState({ run: "", password: "", passwordConfirm: "" });
  const googleRef = useRef(null);
  const googleLoginRef = useRef(null);
  googleLoginRef.current = iniciarSesionGoogle;
  const navigateRef = useRef(null);
  navigateRef.current = navigate;
  const destinoRef = useRef(null);
  destinoRef.current = location.state?.from?.pathname;

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleRef.current) return;
    let activo = true;
    const inicializar = () => {
      if (!activo || !window.google?.accounts?.id || !googleRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          if (!activo) return;
          setMensajeGeneral("");
          setCargando(true);
          try {
            const usuario = await googleLoginRef.current(credential);
            if (usuario.requiereCompletarPerfil) {
              setPerfilGoogle({ run: "", password: "", passwordConfirm: "" });
              setGooglePendiente(credential);
              return;
            }
            const destino = destinoRef.current || (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor" ? "/admin" : "/");
            navigateRef.current(destino, { replace: true });
          } catch (error) {
            setMensajeGeneral(error?.cuerpo?.mensaje || error?.message || "No se pudo iniciar sesión con Google.");
          } finally {
            if (activo) setCargando(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleRef.current, { theme: "outline", size: "large", text: "continue_with", shape: "rectangular", width: 280 });
    };
    if (window.google?.accounts?.id) {
      inicializar();
    } else {
      let script = document.querySelector('script[data-google-identity="true"]');
      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.dataset.googleIdentity = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", inicializar);
      return () => { activo = false; script.removeEventListener("load", inicializar); };
    }
    return () => { activo = false; };
  }, []);

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

  async function completarGoogle(evento) {
    evento.preventDefault();
    const error = reglasCampos.run(perfilGoogle.run) || reglasCampos.password(perfilGoogle.password)
      || reglasCampos.passwordConfirm(perfilGoogle.passwordConfirm, perfilGoogle);
    setMensajeGeneral(error);
    if (error) return;
    setCargando(true);
    try {
      const usuario = await iniciarSesionGoogle(googlePendiente, { run: perfilGoogle.run, password: perfilGoogle.password });
      if (usuario.requiereCompletarPerfil) throw new Error("Completa todos los datos para continuar.");
      setGooglePendiente(null);
      setPerfilGoogle({ run: "", password: "", passwordConfirm: "" });
      navigate(destinoRef.current || "/", { replace: true });
    } catch (error) {
      setMensajeGeneral(error?.cuerpo?.mensaje || error?.message || "No se pudo completar tu cuenta.");
    } finally { setCargando(false); }
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
        {googlePendiente ? <form className="luxury-form" onSubmit={completarGoogle} noValidate>
          <h2 className="h4 luxury-title">Completa tu cuenta</h2>
          <p>Google ya confirmó tu identidad. Ingresa tu RUT y elige una contraseña para Maison Luxury. Después podrás entrar con Google o con tu correo y esta contraseña.</p>
          <p className="small">La contraseña es para esta tienda; no ingreses la de tu cuenta de Google.</p>
          {[{name:"run", label:"RUT", type:"text"}, {name:"password", label:"Contraseña para la tienda", type:"password"}, {name:"passwordConfirm", label:"Confirmar contraseña", type:"password"}].map(c => <div className="mb-3" key={c.name}>
            <label className="form-label form-label-luxury" htmlFor={`google-${c.name}`}>{c.label}</label>
            <input id={`google-${c.name}`} className="form-control form-luxury" type={c.type} name={c.name}
              autoComplete={c.type === "password" ? "new-password" : "off"} required value={perfilGoogle[c.name]}
              onChange={e => setPerfilGoogle(p => ({...p, [c.name]:e.target.value}))} disabled={cargando}/>
          </div>)}
          <p className="small">Contraseña de 4 a 10 caracteres.</p>
          {mensajeGeneral && <div className="alert alert-danger" role="alert">{mensajeGeneral}</div>}
          <button className="btn btn-luxury w-100" disabled={cargando}>{cargando ? "Guardando…" : "Guardar y continuar"}</button>
          <button className="btn btn-link text-gold-light mt-3" type="button" disabled={cargando} onClick={() => {setGooglePendiente(null);setPerfilGoogle({run:"",password:"",passwordConfirm:""});setMensajeGeneral("");}}>Cancelar y volver</button>
        </form> : <form className="luxury-form" onSubmit={enviar} noValidate>
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
        </form>}

        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <div className="mt-4 text-center" hidden={!!googlePendiente}>
            <p className="text-gold-light mb-3">O continúa con</p>
            <div ref={googleRef} className="d-flex justify-content-center" aria-label="Iniciar sesión con Google" />
          </div>
        )}

        <p className="text-center mt-4 mb-0 auth-helper-text">
          ¿Aún no tienes cuenta? <Link to="/registro" className="text-gold-light">Crear cuenta</Link>
        </p>
      </div>
    </section>
  );
}
