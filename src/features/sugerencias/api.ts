import { apiClient } from '../../shared/api/api-client';
import type { ReglaAsociacion } from '../../shared/api/types';

export const sugerenciasApi = {
  listarTodas: () => apiClient.get<ReglaAsociacion[]>('/sugerencias'),
  porProducto: (idProducto: number, limite = 5) =>
    apiClient.get<ReglaAsociacion[]>(`/sugerencias/${idProducto}`, { limite }),
  recalcular: (opciones?: { soporteMinimo?: number; confianzaMinima?: number }) =>
    apiClient.post<{ totalCanastas: number; totalReglas: number }>('/sugerencias/recalcular', opciones ?? {}),
};
