import type { ReactNode } from 'react';

export function Modal({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-1 text-ink-muted hover:bg-surface-alt"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
