import { afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppProviders from "../context/AppProviders";

// Renderiza una vista con Router y contextos, simulando una API vacia para no depender de json-server.
export function renderVista(elemento, ruta = "/", patron = "*") {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => [],
    headers: { get: () => "application/json" },
  }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AppProviders>
        <Routes><Route path={patron} element={elemento} /></Routes>
      </AppProviders>
    </MemoryRouter>
  );
}

afterEach(() => { vi.unstubAllGlobals(); });
