import { useEffect, useState, type FormEvent } from 'react';
import { useCategorias } from '../categorias/hooks';
import { ApiError } from '../../shared/api/api-error';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Modal } from '../../shared/ui/Modal';
import { useToast } from '../../shared/ui/toast-context';
import type { CrearProductoPayload } from './api';
import { useActualizarProducto, useCrearProducto } from './hooks';
import type { Producto } from '../../shared/api/types';

const UNIDADES = ['unidad', 'kg', 'g', 'litro', 'ml', 'paquete'] as const;

export function ProductoFormModal({ producto, onCerrar }: { producto: Producto | null; onCerrar: () => void }) {
  const { data: categorias } = useCategorias();
  const crear = useCrearProducto();
  const actualizar = useActualizarProducto();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CrearProductoPayload>({
    nombre: producto?.nombre ?? '',
    idCategoria: producto?.idCategoria ?? 0,
    marca: producto?.marca ?? '',
    unidadMedida: producto?.unidadMedida ?? 'unidad',
    precioCompra: producto?.precioCompra ?? 0,
    precioVenta: producto?.precioVenta ?? 0,
    stockActual: producto?.stockActual ?? 0,
    stockMinimo: producto?.stockMinimo ?? 0,
  });

  // Las categorias llegan de forma asincrona; en cuanto esten listas, se
  // selecciona la primera por defecto (solo si el formulario aun no tiene una valida).
  useEffect(() => {
    if (!producto && form.idCategoria === 0 && categorias && categorias.length > 0) {
      setForm((actual) => ({ ...actual, idCategoria: categorias[0].id }));
    }
  }, [categorias, producto, form.idCategoria]);

  const guardando = crear.isPending || actualizar.isPending;
  const categoriasListas = (categorias?.length ?? 0) > 0;

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    try {
      if (producto) {
        await actualizar.mutateAsync({ id: producto.id, datos: form });
        toast.exito(`Producto "${form.nombre}" actualizado`);
      } else {
        await crear.mutateAsync(form);
        toast.exito(`Producto "${form.nombre}" creado`);
      }
      onCerrar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el producto');
    }
  }

  return (
    <Modal titulo={producto ? 'Editar producto' : 'Nuevo producto'} onCerrar={onCerrar}>
      <form onSubmit={manejarEnvio} className="flex flex-col gap-3">
        <Input
          etiqueta="Nombre"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Categoria</span>
          <select
            className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={form.idCategoria}
            onChange={(e) => setForm({ ...form, idCategoria: Number(e.target.value) })}
          >
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <Input
          etiqueta="Marca (opcional)"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Unidad de medida</span>
          <select
            className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={form.unidadMedida}
            onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })}
          >
            {UNIDADES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            etiqueta="Precio compra"
            type="number"
            step="0.01"
            min={0}
            required
            value={form.precioCompra}
            onChange={(e) => setForm({ ...form, precioCompra: Number(e.target.value) })}
          />
          <Input
            etiqueta="Precio venta"
            type="number"
            step="0.01"
            min={0}
            required
            value={form.precioVenta}
            onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            etiqueta="Stock actual"
            type="number"
            min={0}
            required
            value={form.stockActual}
            onChange={(e) => setForm({ ...form, stockActual: Number(e.target.value) })}
          />
          <Input
            etiqueta="Stock minimo"
            type="number"
            min={0}
            required
            value={form.stockMinimo}
            onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variante="secundario" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando || !categoriasListas}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
