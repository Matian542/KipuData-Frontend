import { apiClient, type ValorQuery } from '../../shared/api/api-client';
import type { EstadoVenta, MetodoPago, Venta } from '../../shared/api/types';

export interface RegistrarVentaPayload {
  idCliente?: number;
  metodoPago: MetodoPago;
  lineas: { idProducto: number; cantidad: number }[];
}

export interface FiltroVentas {
  estado?: EstadoVenta;
  [clave: string]: ValorQuery;
}

export const ventasApi = {
  listar: (filtro?: FiltroVentas) => apiClient.get<Venta[]>('/ventas', filtro),
  registrar: (datos: RegistrarVentaPayload) => apiClient.post<Venta>('/ventas', datos),
  anular: (id: number) => apiClient.patch<Venta>(`/ventas/${id}/anular`),
};
