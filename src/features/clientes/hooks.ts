import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientesApi, type CrearClientePayload, type RegistrarAbonoPayload } from './api';

const CLAVE_CLIENTES = ['clientes'];
const CLAVE_RIESGO = ['clientes', 'riesgo'];

export function useClientes() {
  return useQuery({ queryKey: CLAVE_CLIENTES, queryFn: clientesApi.listar });
}

export function useRiesgoFiado() {
  return useQuery({ queryKey: CLAVE_RIESGO, queryFn: clientesApi.riesgo });
}

export function useSaldoCliente(idCliente: number | null) {
  return useQuery({
    queryKey: ['clientes', idCliente, 'saldo'],
    queryFn: () => clientesApi.saldo(idCliente!),
    enabled: idCliente !== null,
  });
}

export function useAbonosCliente(idCliente: number | null) {
  return useQuery({
    queryKey: ['clientes', idCliente, 'abonos'],
    queryFn: () => clientesApi.abonos(idCliente!),
    enabled: idCliente !== null,
  });
}

export function useCrearCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearClientePayload) => clientesApi.crear(datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE_CLIENTES }),
  });
}

export function useActualizarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Partial<CrearClientePayload> }) =>
      clientesApi.actualizar(id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE_CLIENTES }),
  });
}

export function useRegistrarAbono(idCliente: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: RegistrarAbonoPayload) => clientesApi.registrarAbono(idCliente, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes', idCliente, 'saldo'] });
      queryClient.invalidateQueries({ queryKey: ['clientes', idCliente, 'abonos'] });
      queryClient.invalidateQueries({ queryKey: CLAVE_RIESGO });
    },
  });
}
