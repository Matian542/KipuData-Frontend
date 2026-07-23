import { CheckCircle2, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type TipoToast = 'exito' | 'error';

interface Toast {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

interface ToastContextValor {
  exito: (mensaje: string) => void;
  error: (mensaje: string) => void;
}

const ToastContext = createContext<ToastContextValor | undefined>(undefined);

const DURACION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const contadorRef = useRef(0);

  const quitar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const agregar = useCallback(
    (tipo: TipoToast, mensaje: string) => {
      const id = ++contadorRef.current;
      setToasts((prev) => [...prev, { id, tipo, mensaje }]);
      setTimeout(() => quitar(id), DURACION_MS);
    },
    [quitar],
  );

  const valor: ToastContextValor = {
    exito: (mensaje) => agregar('exito', mensaje),
    error: (mensaje) => agregar('error', mensaje),
  };

  return (
    <ToastContext.Provider value={valor}>
      {children}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`animate-toast-in pointer-events-auto flex w-80 items-start gap-3 rounded-xl border-2 bg-surface p-4 shadow-lg ${
              toast.tipo === 'exito' ? 'border-primary-300' : 'border-red-300'
            }`}
          >
            {toast.tipo === 'exito' ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-primary-600" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
            )}
            <p className="flex-1 text-sm font-medium text-ink">{toast.mensaje}</p>
            <button
              type="button"
              onClick={() => quitar(toast.id)}
              className="text-ink-muted transition-colors hover:text-ink"
              aria-label="Cerrar notificacion"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValor {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return contexto;
}
