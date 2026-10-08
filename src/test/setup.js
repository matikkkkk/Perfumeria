// Se ejecuta antes que cualquier prueba.

// React 19 avisa si un cambio de estado ocurre fuera de act(); @testing-library/react ya envuelve
// render y fireEvent en act(), pero la bandera debe estar activa.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Los contextos guardan sesion, carrito, cupon y wishlist en localStorage:
// se limpia antes de cada prueba para que ninguna herede datos de otra.
beforeEach(() => {
  localStorage.clear();
});
