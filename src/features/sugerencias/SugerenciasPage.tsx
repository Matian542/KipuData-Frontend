import { Button } from '../../shared/ui/Button';
import { EstadoError, EstadoVacio, Spinner } from '../../shared/ui/EstadoCarga';
import { useRecalcularSugerencias, useTodasLasReglas } from './hooks';

export function SugerenciasPage() {
  const { data: reglas, isLoading, isError } = useTodasLasReglas();
  const recalcular = useRecalcularSugerencias();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Sugerencias de productos</h1>
          <p className="text-sm text-ink-muted">
            Reglas de asociación (Apriori) calculadas sobre el historial de ventas: "quien compra X también compra Y".
          </p>
        </div>
        <Button disabled={recalcular.isPending} onClick={() => recalcular.mutate()}>
          {recalcular.isPending ? 'Recalculando...' : 'Recalcular'}
        </Button>
      </div>

      {recalcular.isSuccess && (
        <p className="mb-4 text-sm text-primary-700">
          Se generaron {recalcular.data.totalReglas} reglas a partir de {recalcular.data.totalCanastas} ventas.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-10 text-ink-muted">
          <Spinner />
        </div>
      )}
      {isError && <EstadoError mensaje="No se pudieron cargar las reglas de asociación." />}
      {!isLoading && !isError && (!reglas || reglas.length === 0) && (
        <EstadoVacio mensaje="Aún no hay reglas calculadas. Presiona 'Recalcular' después de registrar algunas ventas." />
      )}

      {!isLoading && reglas && reglas.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Si compra</th>
                <th className="px-4 py-3 font-medium">Sugerir</th>
                <th className="px-4 py-3 font-medium">Soporte</th>
                <th className="px-4 py-3 font-medium">Confianza</th>
                <th className="px-4 py-3 font-medium">Lift</th>
              </tr>
            </thead>
            <tbody>
              {reglas.map((regla, idx) => (
                <tr key={idx} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{regla.nombreAntecedente}</td>
                  <td className="px-4 py-3 text-ink">{regla.nombreConsecuente}</td>
                  <td className="px-4 py-3 text-ink-muted">{Math.round(regla.soporte * 100)}%</td>
                  <td className="px-4 py-3 text-ink-muted">{Math.round(regla.confianza * 100)}%</td>
                  <td className="px-4 py-3 text-ink-muted">{regla.lift.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
