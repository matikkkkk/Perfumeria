import { useEffect, useState } from "react";
import { guardarStorage, leerStorage } from "../utils/storage";

// Igual que useState, pero el valor se lee de localStorage al inicio y se guarda en cada cambio.
// Con null/undefined la clave se elimina.
export function useStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => leerStorage(clave, valorInicial));

  useEffect(() => {
    guardarStorage(clave, valor);
  }, [clave, valor]);

  return [valor, setValor];
}
