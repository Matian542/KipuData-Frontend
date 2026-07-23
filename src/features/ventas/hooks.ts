import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ventasApi, type FiltroVentas, type RegistrarVentaPayload } from './api';

const CLAVE_VENTAS = ['ventas'];

export function useVentas(filtro?: FiltroVentas) {
  return useQuery({ queryKey: [...CLAVE_VENTAS, filtro], queryFn: () => ventasApi.listar(filtro) });
}

export function useRegistrarVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: RegistrarVentaPayload) => ventasApi.registrar(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_VENTAS });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useAnularVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventasApi.anular(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_VENTAS });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}
