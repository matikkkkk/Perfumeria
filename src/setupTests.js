// Se ejecuta antes de cada archivo de prueba.
import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

// Los contextos guardan sesion, carrito, cupon y wishlist en localStorage:
// se limpia antes de cada prueba para que ninguna herede datos de otra.
beforeEach(() => {
  localStorage.clear();
});


Object.defineProperty(window, "scrollTo", { configurable: true, writable: true, value: vi.fn() });
