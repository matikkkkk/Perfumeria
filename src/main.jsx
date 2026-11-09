import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/style.css";
import "./styles/responsive-polish.css";
import "./styles/commerce-polish.css";
import "./styles/editorial-refinement.css";
import "./styles/luxury-home-refresh.css";
import "./styles/navidad.css";
import "./styles/maison-journal.css";
import "./styles/tema-claro.css";
import "./styles/navidad-global.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AppProviders from "./context/AppProviders.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);

