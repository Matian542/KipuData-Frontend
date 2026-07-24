import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EstadoError, EstadoVacio, Spinner } from '../../shared/ui/EstadoCarga';
import { useAnularVenta, useVentas } from './hooks';

export function VentasHistorial() {
  const { data: ventas, isLoading, isError } = useVentas();
  const anular = useAnularVenta();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8 text-ink-muted">
        <Spinner />
      </div>
    );
  }
  if (isError) return <EstadoError mensaje="No se pudo cargar el historial de ventas." />;
  if (!ventas || ventas.length === 0) return <EstadoVacio mensaje="Aún no hay ventas registradas." />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-alt text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Productos</th>
            <th className="px-4 py-3 font-medium">Pago</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr
              key={venta.id}
              className="border-b border-border transition-colors duration-150 last:border-0 hover:bg-surface-alt/60"
            >
              <td className="px-4 py-3 text-ink-muted">{venta.id}</td>
              <td className="px-4 py-3 text-ink-muted">{new Date(venta.fechaHora).toLocaleString('es-EC')}</td>
              <td className="px-4 py-3 text-ink">
                {venta.lineas.map((l) => `${l.cantidad}x ${l.nombreProducto}`).join(', ')}
              </td>
              <td className="px-4 py-3 text-ink-muted capitalize">{venta.metodoPago}</td>
              <td className="px-4 py-3 text-ink">${venta.total.toFixed(2)}</td>
              <td className="px-4 py-3">
                <Badge tono={venta.estadoVenta === 'anulada' ? 'peligro' : 'exito'}>{venta.estadoVenta}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                {venta.estadoVenta === 'completada' && (
                  <Button
                    variante="fantasma"
                    disabled={anular.isPending}
                    onClick={() => anular.mutate(venta.id)}
                  >
                    Anular
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
