import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, afterEach, describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';
import { usuariosService } from '../services/usuariosService';
import Login from '../pages/tienda/Login';

vi.mock('../services/usuariosService', async original => {
 const m=await original();return {...m,usuariosService:{...m.usuariosService,login:vi.fn(),loginGoogle:vi.fn()}};
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();vi.clearAllMocks();});
function FavoritosPrueba(){
 const {iniciarSesion,cerrarSesion}=useAuth();const {ids,alternar}=useWishlist();
 return <><output aria-label="favoritos">{ids.join(',')}</output><button onClick={()=>alternar('turathi')}>Guardar favorito</button>
 <button onClick={()=>iniciarSesion('a','x')}>Cuenta A</button><button onClick={()=>iniciarSesion('b','x')}>Cuenta B</button><button onClick={cerrarSesion}>Salir</button></>;
}
describe('Favoritos por cuenta',()=>{
 it('no comparte favoritos antiguos, de invitado ni de otras cuentas y conserva los propios',async()=>{
  localStorage.setItem('wishlist',JSON.stringify(['turathi']));
  usuariosService.login.mockImplementation(async correo=>({id:correo,tipo:'Cliente'}));
  const u=userEvent.setup();render(<AuthProvider><WishlistProvider><FavoritosPrueba/></WishlistProvider></AuthProvider>);
  expect(screen.getByLabelText('favoritos')).toHaveTextContent(/^$/);
  await u.click(screen.getByText('Guardar favorito'));
  await u.click(screen.getByText('Cuenta A'));expect(screen.getByLabelText('favoritos')).toHaveTextContent(/^$/);
  await u.click(screen.getByText('Guardar favorito'));expect(screen.getByLabelText('favoritos')).toHaveTextContent('turathi');
  await u.click(screen.getByText('Cuenta B'));expect(screen.getByLabelText('favoritos')).toHaveTextContent(/^$/);
  await u.click(screen.getByText('Cuenta A'));expect(screen.getByLabelText('favoritos')).toHaveTextContent('turathi');
 });
});
describe('Completar registro Google',()=>{
 it('no guarda sesión pendiente y valida RUT y confirmación antes de completar',async()=>{
  vi.stubEnv('VITE_GOOGLE_CLIENT_ID','test-client');let callback;
  vi.stubGlobal('google',{accounts:{id:{initialize:vi.fn(o=>{callback=o.callback}),renderButton:vi.fn()}}});
  usuariosService.loginGoogle.mockResolvedValueOnce({requiereCompletarPerfil:true}).mockResolvedValueOnce({id:'190110222',run:'190110222',tipo:'Cliente',accessToken:'token'});
  render(<MemoryRouter><AuthProvider><Login/></AuthProvider></MemoryRouter>);
  await act(async()=>callback({credential:'google-token'}));
  expect(screen.getByText('Completa tu cuenta')).toBeInTheDocument();expect(localStorage.getItem('usuarioActual')).toBeNull();
  const u=userEvent.setup();await u.type(screen.getByLabelText('RUT'),'123');
  await u.click(screen.getByRole('button',{name:'Guardar y continuar'}));expect(usuariosService.loginGoogle).toHaveBeenCalledTimes(1);
  await u.clear(screen.getByLabelText('RUT'));await u.type(screen.getByLabelText('RUT'),'190110222');
  await u.type(screen.getByLabelText('Contraseña para la tienda'),'clave123');await u.type(screen.getByLabelText('Confirmar contraseña'),'otra');
  await u.click(screen.getByRole('button',{name:'Guardar y continuar'}));expect(screen.getByRole('alert')).toHaveTextContent('no coinciden');
  await u.clear(screen.getByLabelText('Confirmar contraseña'));await u.type(screen.getByLabelText('Confirmar contraseña'),'clave123');
  await u.click(screen.getByRole('button',{name:'Guardar y continuar'}));
  await waitFor(()=>expect(JSON.parse(localStorage.getItem('usuarioActual')).id).toBe('190110222'));
  expect(usuariosService.loginGoogle).toHaveBeenLastCalledWith('google-token',{run:'190110222',password:'clave123'});
 });
});
