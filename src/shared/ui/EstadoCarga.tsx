export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}

export function EstadoVacio({ mensaje }: { mensaje: string }) {
  return <p className="py-10 text-center text-sm text-ink-muted">{mensaje}</p>;
}

export function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {mensaje}
    </p>
  );
}
