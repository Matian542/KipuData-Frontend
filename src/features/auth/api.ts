import { apiClient } from '../../shared/api/api-client';
import type { Sesion } from '../../shared/api/types';

export const authApi = {
  login: (nombreUsuario: string, contrasena: string) =>
    apiClient.post<Sesion>('/auth/login', { nombreUsuario, contrasena }),
};
