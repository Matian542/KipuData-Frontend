import { useState, type FormEvent } from 'react';
import type { Cliente } from '../../shared/api/types';
import { ApiError } from '../../shared/api/api-error';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EstadoError, Spinner } from '../../shared/ui/EstadoCarga';
import { Input } from '../../shared/ui/Input';
import { useToast } from '../../shared/ui/toast-context';
import { useAbonosCliente, useRegistrarAbono, useSaldoCliente } from './hooks';

export function ClienteDetalle({ cliente }: { cliente: Cliente }) {
  const { data: saldo, isLoading, isError } = useSaldoCliente(cliente.id);
  const { data: abonos } = useAbonosCliente(cliente.id);
  const registrarAbono = useRegistrarAbono(cliente.id);
  const toast = useToast();
  const [monto, setMonto] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function manejarAbono(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    const valor = Number(monto);
    if (!valor || valor <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    try {
      await registrarAbono.mutateAsync({ monto: valor });
      toast.exito(`Abono de $${valor.toFixed(2)} registrado`);
      setMonto('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar el abono');
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 text-ink-muted">
        <Spinner />
      </div>
    );
  }
  if (isError || !saldo) return <EstadoError mensaje="No se pudo cargar el saldo del cliente." />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-ink">{saldo.nombres}</h3>
        <p className="text-sm text-ink-muted">
          {cliente.telefono ?? 'Sin teléfono'} · {cliente.barrio ?? 'Sin barrio'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border-2 border-border p-3">
          <p className="text-ink-muted">Límite de crédito</p>
          <p className="font-semibold text-ink">${saldo.limiteCredito.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border-2 border-border p-3">
          <p className="text-ink-muted">Saldo pendiente</p>
          <p className={`font-semibold ${saldo.saldoPendiente > 0 ? 'text-red-600' : 'text-ink'}`}>
            ${saldo.saldoPendiente.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border-2 border-border p-3">
          <p className="text-ink-muted">Total fiado</p>
          <p className="text-ink">${saldo.totalFiado.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border-2 border-border p-3">
          <p className="text-ink-muted">Crédito disponible</p>
          <p className="text-ink">${saldo.creditoDisponible.toFixed(2)}</p>
        </div>
      </div>

      {saldo.saldoPendiente > 0 && (
        <form onSubmit={manejarAbono} className="flex items-end gap-2">
          <div className="flex-1">
            <Input etiqueta="Registrar abono" type="number" min={0} step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} />
          </div>
          <Button type="submit" disabled={registrarAbono.isPending}>
            {registrarAbono.isPending ? 'Guardando...' : 'Abonar'}
          </Button>
        </form>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">Historial de abonos</p>
        {!abonos || abonos.length === 0 ? (
          <p className="text-sm text-ink-muted">Sin abonos registrados.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {abonos.map((abono) => (
              <li key={abono.id} className="flex items-center justify-between border-b border-border py-1">
                <span className="text-ink-muted">{new Date(abono.fechaHora).toLocaleDateString('es-EC')}</span>
                <Badge tono="exito">${abono.monto.toFixed(2)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
