import { tokenStore } from '../auth/token-store';
import { ApiError } from './api-error';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type ValorQuery = string | number | boolean | undefined;

interface OpcionesPeticion {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, ValorQuery>;
}

function construirUrl(path: string, query?: Record<string, ValorQuery>): string {
  const url = new URL(path.replace(/^\//, ''), `${BASE_URL}/`);
  if (query) {
    for (const [clave, valor] of Object.entries(query)) {
      if (valor !== undefined) url.searchParams.set(clave, String(valor));
    }
  }
  return url.toString();
}

async function peticion<T>(path: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const token = tokenStore.obtener();

  const respuesta = await fetch(construirUrl(path, opciones.query), {
    method: opciones.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined,
  });

  if (respuesta.status === 401) {
    tokenStore.limpiar();
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null);
    const mensaje = Array.isArray(cuerpo?.message) ? cuerpo.message.join(', ') : (cuerpo?.message ?? respuesta.statusText);
    throw new ApiError(mensaje, respuesta.status, Array.isArray(cuerpo?.message) ? cuerpo.message : undefined);
  }

  if (respuesta.status === 204) return undefined as T;
  return respuesta.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, query?: Record<string, ValorQuery>) => peticion<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => peticion<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => peticion<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => peticion<T>(path, { method: 'DELETE' }),
};
