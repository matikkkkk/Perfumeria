import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosService } from "../../services/usuariosService";
import { regiones } from "../../data/regiones";
import { limpiarRun, validarFormulario } from "../../utils/validaciones";

const inicial = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  passwordConfirm: "",
  fechaNacimiento: "",
  region: "",
  comuna: "",
  direccion: "",
};

const CAMPOS = Object.keys(inicial);

export default function Registro() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [exito, setExito] = useState("");
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const comunasDisponibles = useMemo(() => {
    const seleccion = regiones.find((r) => r.nombre === datos.region);
    return seleccion?.comunas ?? [];
  }, [datos.region]);

  function validarCampo(nombre, siguiente = datos) {
    const resultado = validarFormulario(siguiente, [nombre]);
    return resultado[nombre] ?? "";
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    const normalizado = name === "run" ? value.toUpperCase() : value;
    const siguiente = {
      ...datos,
      [name]: normalizado,
      ...(name === "region" ? { comuna: "" } : {}),
    };

    setDatos(siguiente);

    if (tocados[name]) {
      setErrores((previo) => ({ ...previo, [name]: validarCampo(name, siguiente) }));
    }

    if (name === "password" && tocados.passwordConfirm) {
      setErrores((previo) => ({
        ...previo,
        passwordConfirm: validarCampo("passwordConfirm", siguiente),
      }));
    }

    if (name === "region") {
      setErrores((previo) => ({ ...previo, comuna: tocados.comuna ? validarCampo("comuna", siguiente) : previo.comuna }));
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
    setExito("");

    const nuevosErrores = validarFormulario(datos, CAMPOS);
    setErrores(nuevosErrores);
    setTocados(CAMPOS.reduce((acc, campo) => ({ ...acc, [campo]: true }), {}));
    if (Object.keys(nuevosErrores).length) return;

    setGuardando(true);
    try {
      const correoNormalizado = datos.correo.trim().toLowerCase();
      const runNormalizado = limpiarRun(datos.run);
      const [porCorreo, porRun] = await Promise.all([
        usuariosService.listar(`?correo=${encodeURIComponent(correoNormalizado)}`),
        usuariosService.listar(`?run=${encodeURIComponent(runNormalizado)}`),
      ]);

      if (porCorreo.length) {
        setErrores((previo) => ({ ...previo, correo: "Ya existe una cuenta registrada con ese correo." }));
        setTocados((previo) => ({ ...previo, correo: true }));
        return;
      }

      if (porRun.length) {
        setErrores((previo) => ({ ...previo, run: "Ya existe una cuenta registrada con ese RUN." }));
        setTocados((previo) => ({ ...previo, run: true }));
        return;
      }

      await usuariosService.crear({
        run: runNormalizado,
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: correoNormalizado,
        password: datos.password,
        fechaNacimiento: datos.fechaNacimiento,
        tipo: "Cliente",
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion.trim(),
      });

      setExito("¡Tu cuenta fue creada! Ya puedes iniciar sesión.");
      setDatos(inicial);
      setErrores({});
      setTocados({});
      setTimeout(() => navigate("/login"), 900);
    } catch {
      setMensajeGeneral("No se pudo crear la cuenta. Verifica que la API esté disponible e inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  }


  return (
    <section className="container py-5 my-4" style={{ maxWidth: 920 }}>
      <div className="text-center mb-5 hero-header">
        <span className="text-gold text-uppercase tracking-widest fs-7">Luxury</span>
        <h1 className="display-5 luxury-title mt-2">Registro de usuario</h1>
        <div className="gold-divider mx-auto my-3"></div>
      </div>

      <div className="card luxury-card p-4 p-md-5 auth-card">
        <form className="luxury-form" onSubmit={enviar} noValidate>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label form-label-luxury" htmlFor="registro-run">RUN</label>
              <input
                id="registro-run"
                className={`form-control form-luxury ${tocados.run && errores.run ? "is-invalid" : ""}`}
                name="run"
                type="text"
                placeholder="19011022K"
                maxLength={10}
                required
                value={datos.run}
                onChange={cambiar}
                onBlur={marcarTocado}
              />
              {tocados.run && errores.run && <div className="error d-block">{errores.run}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label form-label-luxury" htmlFor="registro-nombre">Nombre</label>
              <input
                id="registro-nombre"
                className={`form-control form-luxury ${tocados.nombre && errores.nombre ? "is-invalid" : ""}`}
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                maxLength={50}
                required
                value={datos.nombre}
                onChange={cambiar}
                onBlur={marcarTocado}
              />
              {tocados.nombre && errores.nombre && <div className="error d-block">{errores.nombre}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label form-label-luxury" htmlFor="registro-apellidos">Apellidos</label>
              <input
                id="registro-apellidos"
                className={`form-control form-luxury ${tocados.apellidos && errores.apellidos ? "is-invalid" : ""}`}
                name="apellidos"
                type="text"
                placeholder="Tus apellidos"
                maxLength={100}
                required
                value={datos.apellidos}
                onChange={cambiar}
                onBlur={marcarTocado}
              />
              {tocados.apellidos && errores.apellidos && <div className="error d-block">{errores.apellidos}</div>}
            </div>

            <div className="col-12">
              <label className="form-label form-label-luxury" htmlFor="registro-correo">Correo electrónico</label>
              <input
                id="registro-correo"
                className={`form-control form-luxury ${tocados.correo && errores.correo ? "is-invalid" : ""}`}
                name="correo"
                type="email"
                placeholder="tu@correo.com"
                maxLength={100}
                required
                value={datos.correo}
                onChange={cambiar}
                onBlur={marcarTocado}
                autoComplete="email"
              />
              {tocados.correo && errores.correo && <div className="error d-block">{errores.correo}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-password">Contraseña</label>
              <input
                id="registro-password"
                className={`form-control form-luxury ${tocados.password && errores.password ? "is-invalid" : ""}`}
                name="password"
                type="password"
                placeholder="Entre 4 y 10 caracteres"
                minLength={4}
                maxLength={10}
                required
                value={datos.password}
                onChange={cambiar}
                onBlur={marcarTocado}
                autoComplete="new-password"
              />
              {tocados.password && errores.password && <div className="error d-block">{errores.password}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-passwordConfirm">Confirmar contraseña</label>
              <input
                id="registro-passwordConfirm"
                className={`form-control form-luxury ${tocados.passwordConfirm && errores.passwordConfirm ? "is-invalid" : ""}`}
                name="passwordConfirm"
                type="password"
                placeholder="Repite tu contraseña"
                minLength={4}
                maxLength={10}
                required
                value={datos.passwordConfirm}
                onChange={cambiar}
                onBlur={marcarTocado}
                autoComplete="new-password"
              />
              {tocados.passwordConfirm && errores.passwordConfirm && <div className="error d-block">{errores.passwordConfirm}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-fechaNacimiento">Fecha de nacimiento</label>
              <input
                id="registro-fechaNacimiento"
                className="form-control form-luxury"
                name="fechaNacimiento"
                type="date"
                value={datos.fechaNacimiento}
                onChange={cambiar}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-region">Región</label>
              <select
                id="registro-region"
                className={`form-select form-luxury ${tocados.region && errores.region ? "is-invalid" : ""}`}
                name="region"
                required
                value={datos.region}
                onChange={cambiar}
                onBlur={marcarTocado}
              >
                <option value="">Seleccione región</option>
                {regiones.map((region) => (
                  <option key={region.nombre} value={region.nombre}>{region.nombre}</option>
                ))}
              </select>
              {tocados.region && errores.region && <div className="error d-block">{errores.region}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-comuna">Comuna</label>
              <select
                id="registro-comuna"
                className={`form-select form-luxury ${tocados.comuna && errores.comuna ? "is-invalid" : ""}`}
                name="comuna"
                required
                value={datos.comuna}
                onChange={cambiar}
                onBlur={marcarTocado}
                disabled={!datos.region}
              >
                <option value="">Seleccione comuna</option>
                {comunasDisponibles.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
              {tocados.comuna && errores.comuna && <div className="error d-block">{errores.comuna}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label form-label-luxury" htmlFor="registro-direccion">Dirección</label>
              <input
                id="registro-direccion"
                className={`form-control form-luxury ${tocados.direccion && errores.direccion ? "is-invalid" : ""}`}
                name="direccion"
                type="text"
                placeholder="Calle y número"
                maxLength={300}
                required
                value={datos.direccion}
                onChange={cambiar}
                onBlur={marcarTocado}
              />
              {tocados.direccion && errores.direccion && <div className="error d-block">{errores.direccion}</div>}
            </div>
          </div>

          {mensajeGeneral && <div className="alert alert-danger mt-3" role="alert">{mensajeGeneral}</div>}
          {exito && <div className="alert alert-success mt-3" role="status">{exito}</div>}

          <button className="btn btn-luxury w-100 mt-4" type="submit" disabled={guardando}>
            {guardando ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 auth-helper-text">
          ¿Ya tienes cuenta? <Link to="/login" className="text-gold-light">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
