import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderConApp } from '../../utils';
import ResumenCarrito from '../../../components/carrito/ResumenCarrito';

describe('Vista Carrito: ResumenCarrito (estado)', () => {
  it('actualiza el cupón escrito por el cliente', async () => {
    localStorage.setItem('carrito', JSON.stringify([{ productoId: '1', codigo: 'LUX001', nombre: 'Turathi Blue', marca: 'Afnan', imagen: '/img/hero-banner.jpg', precio: 28000, cantidad: 1, stock: 5, stockCritico: 1 }]));
    renderConApp(<ResumenCarrito onFinalizar={vi.fn()} />);
    const campo = screen.getByLabelText('Cupón de descuento');
    await userEvent.setup().type(campo, 'luxury10');
    expect(campo).toHaveValue('luxury10');
  });
});
