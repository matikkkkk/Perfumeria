import { fireEvent, render, screen } from "@testing-library/react";
import NewsletterForm from "./NewsletterForm";

function escribirYEnviar(correo) {
  fireEvent.change(screen.getByLabelText("Correo para el newsletter"), { target: { value: correo } });
  fireEvent.click(screen.getByRole("button", { name: "Suscribirse" }));
}

describe("NewsletterForm", () => {
  it("al inicio no muestra ningún mensaje (renderizado condicional)", () => {
    render(<NewsletterForm />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("el estado del input cambia cuando el usuario escribe", () => {
    render(<NewsletterForm />);
    const input = screen.getByLabelText("Correo para el newsletter");
    fireEvent.change(input, { target: { value: "ana@gmail.com" } });
    expect(input.value).toBe("ana@gmail.com");
  });

  it("con un correo inválido muestra el error y no limpia el campo", () => {
    render(<NewsletterForm />);
    escribirYEnviar("ana@hotmail.com");
    expect(screen.getByRole("status").textContent).toContain("Ingresa un correo válido");
    expect(screen.getByLabelText("Correo para el newsletter").value).toBe("ana@hotmail.com");
  });

  it("con un correo válido agradece y vacía el campo", () => {
    render(<NewsletterForm />);
    escribirYEnviar("ana@duoc.cl");
    expect(screen.getByRole("status").textContent).toBe("¡Gracias por suscribirte!");
    expect(screen.getByLabelText("Correo para el newsletter").value).toBe("");
  });
});
