function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primeras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return primeras.join('') || '?';
}

export function Avatar({ nombre, className = '' }: { nombre: string; className?: string }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white shadow-sm ${className}`}
    >
      {iniciales(nombre)}
    </div>
  );
}
