import { useState, type FormEvent } from 'react';
import type { Cliente } from '../../shared/api/types';
import { ApiError } from '../../shared/api/api-error';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Modal } from '../../shared/ui/Modal';
import { useToast } from '../../shared/ui/toast-context';
import type { CrearClientePayload } from './api';
import { useActualizarCliente, useCrearCliente } from './hooks';

export function ClienteFormModal({ cliente, onCerrar }: { cliente: Cliente | null; onCerrar: () => void }) {
  const crear = useCrearCliente();
  const actualizar = useActualizarCliente();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CrearClientePayload>({
    nombres: cliente?.nombres ?? '',
    cedula: cliente?.cedula ?? '',
    telefono: cliente?.telefono ?? '',
    barrio: cliente?.barrio ?? '',
    clienteFrecuente: cliente?.clienteFrecuente ?? false,
    limiteCredito: cliente?.limiteCredito ?? 0,
  });

  const guardando = crear.isPending || actualizar.isPending;

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    try {
      const datos = { ...form, cedula: form.cedula || undefined };
      if (cliente) {
        await actualizar.mutateAsync({ id: cliente.id, datos });
        toast.exito(`Cliente "${form.nombres}" actualizado`);
      } else {
        await crear.mutateAsync(datos);
        toast.exito(`Cliente "${form.nombres}" registrado`);
      }
      onCerrar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el cliente');
    }
  }

  return (
    <Modal titulo={cliente ? 'Editar cliente' : 'Nuevo cliente'} onCerrar={onCerrar}>
      <form onSubmit={manejarEnvio} className="flex flex-col gap-3">
        <Input
          etiqueta="Nombres"
          required
          value={form.nombres}
          onChange={(e) => setForm({ ...form, nombres: e.target.value })}
        />
        <Input
          etiqueta="Cedula (opcional, 10 digitos)"
          value={form.cedula}
          onChange={(e) => setForm({ ...form, cedula: e.target.value })}
        />
        <Input
          etiqueta="Telefono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
        <Input
          etiqueta="Barrio"
          value={form.barrio}
          onChange={(e) => setForm({ ...form, barrio: e.target.value })}
        />
        <Input
          etiqueta="Limite de credito (fiado)"
          type="number"
          min={0}
          step="0.01"
          value={form.limiteCredito}
          onChange={(e) => setForm({ ...form, limiteCredito: Number(e.target.value) })}
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.clienteFrecuente}
            onChange={(e) => setForm({ ...form, clienteFrecuente: e.target.checked })}
          />
          Cliente frecuente
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variante="secundario" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
