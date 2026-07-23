import type { NivelRiesgo } from '../../shared/api/types';
import { Badge } from '../../shared/ui/Badge';
import { EstadoError, EstadoVacio, Spinner } from '../../shared/ui/EstadoCarga';
import { useRiesgoFiado } from './hooks';

const TONO_RIESGO: Record<NivelRiesgo, 'neutro' | 'exito' | 'advertencia' | 'peligro'> = {
  'Sin deuda': 'neutro',
  Bajo: 'exito',
  Medio: 'advertencia',
  Alto: 'peligro',
  'Alto (excede limite)': 'peligro',
};

export function RiesgoFiadoTable() {
  const { data: riesgos, isLoading, isError } = useRiesgoFiado();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8 text-ink-muted">
        <Spinner />
      </div>
    );
  }
  if (isError) return <EstadoError mensaje="No se pudo cargar el riesgo de fiado." />;
  if (!riesgos || riesgos.length === 0) return <EstadoVacio mensaje="Ningun cliente tiene deuda activa." />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-alt text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Saldo pendiente</th>
            <th className="px-4 py-3 font-medium">% cupo usado</th>
            <th className="px-4 py-3 font-medium">Dias sin abonar</th>
            <th className="px-4 py-3 font-medium">Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {riesgos.map((r) => (
            <tr key={r.idCliente} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-ink">{r.nombres}</td>
              <td className="px-4 py-3 text-ink">${r.saldoPendiente.toFixed(2)}</td>
              <td className="px-4 py-3 text-ink-muted">
                {r.pctUtilizacionCredito !== null ? `${r.pctUtilizacionCredito}%` : '—'}
              </td>
              <td className="px-4 py-3 text-ink-muted">{r.diasSinAbonar ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge tono={TONO_RIESGO[r.nivelRiesgo]}>{r.nivelRiesgo}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
