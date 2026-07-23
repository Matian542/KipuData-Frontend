import type { Sesion } from '../api/types';

const CLAVE_SESION = 'kipu.sesion';

/**
 * Almacen de sesion fuera de React (localStorage), para que el cliente API
 * pueda leer el token sin depender del contexto de React (evita ciclos de import).
 */
export const tokenStore = {
  obtener(): string | null {
    return this.obtenerSesion()?.token ?? null;
  },
  obtenerSesion(): Sesion | null {
    const crudo = localStorage.getItem(CLAVE_SESION);
    if (!crudo) return null;
    try {
      return JSON.parse(crudo) as Sesion;
    } catch {
      return null;
    }
  },
  guardar(sesion: Sesion): void {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  },
  limpiar(): void {
    localStorage.removeItem(CLAVE_SESION);
  },
};
