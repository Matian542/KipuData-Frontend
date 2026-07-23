import { Navigate, Outlet } from 'react-router-dom';
import type { RolUsuario } from '../api/types';
import { useAuth } from './auth-context';

/** Restringe rutas ya protegidas por ProtectedRoute a roles especificos (UX; el backend es quien realmente lo exige). */
export function RoleRoute({ rolesPermitidos }: { rolesPermitidos: RolUsuario[] }) {
  const { usuario } = useAuth();

  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/ventas" replace />;
  }

  return <Outlet />;
}
