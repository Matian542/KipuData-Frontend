import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma';

const CLASES_VARIANTE: Record<Variante, string> = {
  primario: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md focus-visible:outline-primary-600',
  secundario: 'bg-surface text-ink border border-border shadow-sm hover:border-primary-300 hover:bg-primary-50/40',
  peligro: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md focus-visible:outline-red-700',
  fantasma: 'bg-transparent text-ink-muted hover:bg-surface-alt hover:text-ink',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variante = 'primario', className = '', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${CLASES_VARIANTE[variante]} ${className}`}
      {...props}
    />
  );
});
