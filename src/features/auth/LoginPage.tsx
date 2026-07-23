import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/auth/auth-context';
import { ApiError } from '../../shared/api/api-error';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Logo } from '../../shared/ui/Logo';

export function LoginPage() {
  const { usuario, cargando, iniciarSesion } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (usuario) {
    return <Navigate to="/ventas" replace />;
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    try {
      await iniciarSesion(nombreUsuario, contrasena);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesion');
    }
  }

  return (
    <div className="flex min-h-svh">
      <div className="hidden w-1/3 shrink-0 flex-col items-center justify-center bg-primary-500 p-10 md:flex">
        <Logo sobreVerde tamanoIcono="h-16" className="scale-125" />
        <p className="mt-6 max-w-xs text-center text-sm text-ink/70">
          Ventas, fiados e inventario de tu tienda de barrio, en un solo lugar.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface-alt px-4">
        <div className="w-full max-w-sm rounded-xl border-2 border-border bg-surface p-8 shadow-lg">
          <Logo className="justify-center md:hidden" tamanoIcono="h-12" />

          <h1 className="mt-2 text-center text-lg font-semibold text-ink md:mt-0 md:text-left">Inicia sesion</h1>
          <p className="mb-6 text-center text-sm text-ink-muted md:text-left">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
            <Input
              etiqueta="Usuario"
              placeholder="Ingresa tu usuario"
              autoFocus
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              autoComplete="username"
            />
            <Input
              etiqueta="Contrasena"
              placeholder="Ingresa tu contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={cargando} className="mt-2 w-full">
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
