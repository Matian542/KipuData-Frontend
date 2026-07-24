import { apiClient } from '../../shared/api/api-client';
import type { Producto } from '../../shared/api/types';

export interface CrearProductoPayload {
  nombre: string;
  idCategoria: number;
  marca?: string;
  codigoBarras?: string;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
}

export const productosApi = {
  listar: (soloActivos?: boolean) => apiClient.get<Producto[]>('/productos', { activos: soloActivos }),
  crear: (datos: CrearProductoPayload) => apiClient.post<Producto>('/productos', datos),
  actualizar: (id: number, datos: Partial<CrearProductoPayload>) =>
    apiClient.patch<Producto>(`/productos/${id}`, datos),
  buscarPorCodigoBarras: (codigo: string) =>
    apiClient.get<Producto>(`/productos/codigo-barras/${encodeURIComponent(codigo)}`),
};
