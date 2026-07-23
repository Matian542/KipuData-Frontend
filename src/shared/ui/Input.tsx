import { type InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { etiqueta, error, className = '', id, ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {etiqueta && <span className="font-medium text-ink">{etiqueta}</span>}
      <input
        ref={ref}
        id={id}
        className={`rounded-lg border bg-surface px-3 py-2 text-ink outline-none transition-all duration-150
          hover:border-ink-muted/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-100
          ${error ? 'border-red-400' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
});
