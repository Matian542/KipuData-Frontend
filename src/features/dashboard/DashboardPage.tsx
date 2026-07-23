import { Card } from '../../shared/ui/Card';

/**
 * Vista general para el dueno (KPIs de ventas, riesgo de fiado, stock bajo, etc.).
 * Placeholder: la data y los graficos se implementan en una siguiente iteracion.
 */
export function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted">Vista general del negocio para el dueno</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Ventas de hoy', 'Fiado pendiente', 'Productos con stock bajo', 'Clientes en riesgo'].map((titulo) => (
          <Card key={titulo}>
            <p className="text-sm text-ink-muted">{titulo}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">—</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex min-h-64 items-center justify-center">
        <p className="text-sm text-ink-muted">
          Proximamente: graficos de ventas, productos mas vendidos y evolucion del fiado.
        </p>
      </Card>
    </div>
  );
}
