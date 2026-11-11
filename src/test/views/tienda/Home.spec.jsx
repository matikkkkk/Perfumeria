import { screen } from '@testing-library/react';
import { renderConApp } from '../../utils';
import Destacados from '../../../components/home/Destacados';

describe('Vista Home: componente Destacados (renderizado)', () => {
  it('muestra el título de la sección', () => {
    renderConApp(<Destacados productos={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Los más buscados' })).toBeInTheDocument();
  });
});
