import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sugerenciasApi } from './api';

export function useTodasLasReglas() {
  return useQuery({ queryKey: ['sugerencias'], queryFn: sugerenciasApi.listarTodas });
}

export function useSugerenciasProducto(idProducto: number | null) {
  return useQuery({
    queryKey: ['sugerencias', idProducto],
    queryFn: () => sugerenciasApi.porProducto(idProducto!),
    enabled: idProducto !== null,
  });
}

export function useRecalcularSugerencias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sugerenciasApi.recalcular(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sugerencias'] }),
  });
}
