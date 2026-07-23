import type { ReactNode } from 'react';

type Tono = 'neutro' | 'exito' | 'advertencia' | 'peligro';

const CLASES_TONO: Record<Tono, string> = {
  neutro: 'bg-surface-alt text-ink-muted border-border',
  exito: 'bg-primary-50 text-primary-700 border-primary-100',
  advertencia: 'bg-amber-50 text-amber-700 border-amber-200',
  peligro: 'bg-red-50 text-red-700 border-red-200',
};

export function Badge({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${CLASES_TONO[tono]}`}>
      {children}
    </span>
  );
}
