import { apiClient } from '../../shared/api/api-client';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export const categoriasApi = {
  listar: () => apiClient.get<Categoria[]>('/categorias'),
};
