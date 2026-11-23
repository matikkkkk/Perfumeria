import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, it, expect } from 'vitest';
import BoletaAcciones from '../components/BoletaAcciones';
import { ordenesService } from '../services/ordenesService';
vi.mock('../services/ordenesService',()=>({ordenesService:{estadoCorreo:vi.fn(),solicitarCorreo:vi.fn()}}));
it('permite solicitar de nuevo una boleta rechazada por SMTP',async()=>{
 ordenesService.estadoCorreo.mockResolvedValue({estado:'ERROR',mensaje:'Credenciales rechazadas'});
 ordenesService.solicitarCorreo.mockResolvedValue({estado:'PENDIENTE',mensaje:'En cola'});
 render(<BoletaAcciones ordenId={12}/>);
 const boton=await screen.findByRole('button',{name:'Reintentar envío por correo'});
 expect(boton).toBeEnabled();await userEvent.click(boton);
 expect(ordenesService.solicitarCorreo).toHaveBeenCalledWith(12);
});
