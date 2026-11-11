import { useTema } from "../../context/TemaContext";
export default function SelectorTema() {
  const { tema, alternarTema } = useTema();
  return <button type="button" className="nav-icon-btn selector-tema" onClick={alternarTema}
    aria-label={tema === "claro" ? "Activar modo oscuro" : "Activar modo claro"}
    title={tema === "claro" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"} aria-pressed={tema === "claro"}>
    <i className={`bi bi-${tema === "claro" ? "moon" : "sun"}`} aria-hidden="true" />
  </button>;
}
