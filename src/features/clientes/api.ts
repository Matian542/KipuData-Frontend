import { apiClient } from '../../shared/api/api-client';
import type { Cliente, PagoFiado, RiesgoFiado, SaldoCliente } from '../../shared/api/types';

export interface CrearClientePayload {
  nombres: string;
  cedula?: string;
  telefono?: string;
  barrio?: string;
  clienteFrecuente?: boolean;
  limiteCredito?: number;
}

export interface RegistrarAbonoPayload {
  monto: number;
  metodoPago?: 'efectivo' | 'transferencia';
  observacion?: string;
}

export const clientesApi = {
  listar: () => apiClient.get<Cliente[]>('/clientes'),
  crear: (datos: CrearClientePayload) => apiClient.post<Cliente>('/clientes', datos),
  actualizar: (id: number, datos: Partial<CrearClientePayload>) => apiClient.patch<Cliente>(`/clientes/${id}`, datos),
  saldo: (id: number) => apiClient.get<SaldoCliente>(`/clientes/${id}/saldo`),
  riesgo: () => apiClient.get<RiesgoFiado[]>('/clientes/riesgo'),
  abonos: (id: number) => apiClient.get<PagoFiado[]>(`/clientes/${id}/abonos`),
  registrarAbono: (id: number, datos: RegistrarAbonoPayload) =>
    apiClient.post<PagoFiado>(`/clientes/${id}/abonos`, datos),
};
