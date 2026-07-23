import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productosApi, type CrearProductoPayload } from './api';

const CLAVE_PRODUCTOS = ['productos'];

export function useProductos() {
  return useQuery({ queryKey: CLAVE_PRODUCTOS, queryFn: () => productosApi.listar() });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearProductoPayload) => productosApi.crear(datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE_PRODUCTOS }),
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Partial<CrearProductoPayload> }) =>
      productosApi.actualizar(id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE_PRODUCTOS }),
  });
}
