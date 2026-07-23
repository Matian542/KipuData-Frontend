import { LayoutDashboard, LogOut, Package, ShoppingCart, Sparkles, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

const ENLACES = [
  { to: '/dashboard', etiqueta: 'Dashboard', icono: LayoutDashboard, soloDueno: true },
  { to: '/ventas', etiqueta: 'Ventas', icono: ShoppingCart },
  { to: '/productos', etiqueta: 'Productos', icono: Package },
  { to: '/clientes', etiqueta: 'Clientes y fiados', icono: Users },
  { to: '/sugerencias', etiqueta: 'Sugerencias', icono: Sparkles },
];

export function AppLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const enlacesVisibles = ENLACES.filter((enlace) => !enlace.soloDueno || usuario?.rol === 'dueno');

  return (
    <div className="flex h-svh">
      <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        <div className="border-b border-border px-4 py-4">
          <Logo tamanoIcono="h-7" />
        </div>

        <nav className="mt-4 flex flex-col gap-0.5 px-3">
          {enlacesVisibles.map((enlace) => {
            const Icono = enlace.icono;
            return (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-muted hover:translate-x-0.5 hover:bg-surface-alt hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-500 transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <Icono
                      size={18}
                      strokeWidth={2}
                      className={isActive ? 'text-primary-600' : 'text-ink-muted/70 group-hover:text-ink'}
                    />
                    {enlace.etiqueta}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar nombre={usuario?.nombreCompleto ?? '?'} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium text-ink">{usuario?.nombreCompleto}</p>
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium capitalize text-primary-700">
                {usuario?.rol}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface-alt p-8">
        <Outlet />
      </main>
    </div>
  );
}
