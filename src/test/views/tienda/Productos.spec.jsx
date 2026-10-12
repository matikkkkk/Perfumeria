import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { crearFiltrosVacios } from '../../../utils/filtrosProductos';
import PanelFiltros from '../../../components/productos/PanelFiltros';

describe('Vista Productos: PanelFiltros (eventos)', () => {
  it('notifica la opción elegida', async () => {
    const onAlternar = vi.fn();
    render(<PanelFiltros
      opciones={{ categoria: ['intensos'], ocasion: [], humor: ['poderoso'], familia: [], estacion: [], tipo: [], concentracion: [], ml: [] }}
      seleccion={crearFiltrosVacios()}
      categorias={[{ id: 'intensos', nombre: 'Intensos' }]}
      onAlternar={onAlternar} onLimpiar={vi.fn()}
    />);
    await userEvent.setup().click(screen.getByRole('checkbox', { name: 'Poderoso' }));
    expect(onAlternar).toHaveBeenCalledWith('humor', 'poderoso');
  });
});
