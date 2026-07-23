import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../../features/auth/api';
import type { Usuario } from '../api/types';
import { tokenStore } from './token-store';

interface AuthContextValor {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (nombreUsuario: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => tokenStore.obtenerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(false);

  const valor = useMemo<AuthContextValor>(
    () => ({
      usuario,
      cargando,
      async iniciarSesion(nombreUsuario, contrasena) {
        setCargando(true);
        try {
          const sesion = await authApi.login(nombreUsuario, contrasena);
          tokenStore.guardar(sesion);
          setUsuario(sesion.usuario);
        } finally {
          setCargando(false);
        }
      },
      cerrarSesion() {
        tokenStore.limpiar();
        setUsuario(null);
      },
    }),
    [usuario, cargando],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
