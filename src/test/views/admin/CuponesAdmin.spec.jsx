import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderConApp } from '../../utils';
import CuponesAdmin from '../../../pages/admin/CuponesAdmin';

vi.mock('../../../services/cuponesService', () => ({
  cuponesService: { listar: vi.fn().mockResolvedValue([]) },
}));

describe('Vista Cupones: formulario principal', () => {
  it('muestra el formulario para crear un cupón', async () => {
    renderConApp(<CuponesAdmin />);
    expect(await screen.findByRole('heading', { name: 'Gestión de cupones' })).toBeInTheDocument();
    expect(screen.getByLabelText('Código')).toBeInTheDocument();
    expect(screen.getByLabelText('Descuento (%)')).toBeInTheDocument();
  });
});
