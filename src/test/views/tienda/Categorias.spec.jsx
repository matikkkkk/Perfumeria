import { screen } from '@testing-library/react';
import { renderConApp } from '../../utils';
import TarjetaCategoria from '../../../components/categorias/TarjetaCategoria';

describe('Vista Categorias: TarjetaCategoria (props)', () => {
  it('representa correctamente la categoría recibida', () => {
    renderConApp(<TarjetaCategoria categoria={{ id: 'intensos', nombre: 'Intensos', descripcion: 'Estela larga y carácter marcado.', imagen: '/img/fondo-coleccion-hombre.jpg' }} total={5} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Intensos' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Intensos' })).toHaveAttribute('src', '/img/fondo-coleccion-hombre.jpg');
  });
});
