import { useQuery } from '@tanstack/react-query';
import { categoriasApi } from './api';

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: categoriasApi.listar });
}
