import { useMemo, useState } from 'react';
import type { Cliente } from '../../shared/api/types';
import { Button } from '../../shared/ui/Button';
import { EstadoError, EstadoVacio, Spinner } from '../../shared/ui/EstadoCarga';
import { Input } from '../../shared/ui/Input';
import { ClienteDetalle } from './ClienteDetalle';
import { ClienteFormModal } from './ClienteFormModal';
import { RiesgoFiadoTable } from './RiesgoFiadoTable';
import { useClientes } from './hooks';

type Pestana = 'clientes' | 'riesgo';

export function ClientesPage() {
  const { data: clientes, isLoading, isError } = useClientes();
  const [pestana, setPestana] = useState<Pestana>('clientes');
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null | undefined>(undefined);

  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return clientes;
    return clientes.filter((c) => c.nombres.toLowerCase().includes(texto));
  }, [clientes, busqueda]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Clientes y fiados</h1>
          <p className="text-sm text-ink-muted">Cupo de credito, saldos y abonos</p>
        </div>
        <Button onClick={() => setClienteEnEdicion(null)}>Nuevo cliente</Button>
      </div>

      <div className="mb-4 inline-flex gap-1 rounded-lg border border-border bg-surface-alt p-1">
        <button
          type="button"
          onClick={() => setPestana('clientes')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
            pestana === 'clientes' ? 'bg-surface text-primary-700 shadow-sm' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Clientes
        </button>
        <button
          type="button"
          onClick={() => setPestana('riesgo')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
            pestana === 'riesgo' ? 'bg-surface text-primary-700 shadow-sm' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Riesgo de fiado
        </button>
      </div>

      {pestana === 'riesgo' && <RiesgoFiadoTable />}

      {pestana === 'clientes' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 max-w-xs">
              <Input placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            {isLoading && (
              <div className="flex justify-center py-8 text-ink-muted">
                <Spinner />
              </div>
            )}
            {isError && <EstadoError mensaje="No se pudieron cargar los clientes." />}
            {!isLoading && clientesFiltrados.length === 0 && <EstadoVacio mensaje="No hay clientes que coincidan." />}

            {!isLoading && clientesFiltrados.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-alt text-ink-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="px-4 py-3 font-medium">Barrio</th>
                      <th className="px-4 py-3 font-medium">Limite credito</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        onClick={() => setClienteSeleccionado(cliente)}
                        className={`cursor-pointer border-b border-border transition-colors duration-150 last:border-0 hover:bg-surface-alt/60 ${
                          clienteSeleccionado?.id === cliente.id
                            ? 'bg-primary-50 shadow-[inset_3px_0_0_0_var(--color-primary-500)] hover:bg-primary-50'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-ink">{cliente.nombres}</td>
                        <td className="px-4 py-3 text-ink-muted">{cliente.barrio ?? '—'}</td>
                        <td className="px-4 py-3 text-ink-muted">${cliente.limiteCredito.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variante="fantasma"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClienteEnEdicion(cliente);
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div
            className={`h-fit rounded-xl border-2 bg-surface p-5 transition-colors duration-150 ${
              clienteSeleccionado ? 'border-primary-200 shadow-md' : 'border-border shadow-sm'
            }`}
          >
            {clienteSeleccionado ? (
              <ClienteDetalle cliente={clienteSeleccionado} />
            ) : (
              <p className="text-sm text-ink-muted">Selecciona un cliente para ver su saldo.</p>
            )}
          </div>
        </div>
      )}

      {clienteEnEdicion !== undefined && (
        <ClienteFormModal cliente={clienteEnEdicion} onCerrar={() => setClienteEnEdicion(undefined)} />
      )}
    </div>
  );
}
