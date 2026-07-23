import { ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ApiError } from '../../shared/api/api-error';
import type { MetodoPago, Producto } from '../../shared/api/types';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { useToast } from '../../shared/ui/toast-context';
import { useClientes } from '../clientes/hooks';
import { useProductos } from '../productos/hooks';
import { useSugerenciasProducto } from '../sugerencias/hooks';
import { VentasHistorial } from './VentasHistorial';
import { useRegistrarVenta } from './hooks';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

const METODOS_PAGO: { valor: MetodoPago; etiqueta: string }[] = [
  { valor: 'efectivo', etiqueta: 'Efectivo' },
  { valor: 'tarjeta', etiqueta: 'Tarjeta' },
  { valor: 'transferencia', etiqueta: 'Transferencia' },
  { valor: 'fiado', etiqueta: 'Fiado' },
];

export function VentasPage() {
  const { data: productos } = useProductos();
  const { data: clientes } = useClientes();
  const registrarVenta = useRegistrarVenta();
  const toast = useToast();

  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [ultimoAgregado, setUltimoAgregado] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: sugerencias } = useSugerenciasProducto(ultimoAgregado);

  const productosFiltrados = useMemo(() => {
    if (!productos) return [];
    const texto = busqueda.trim().toLowerCase();
    const base = texto
      ? productos.filter((p) => p.nombre.toLowerCase().includes(texto))
      : productos;
    return base.filter((p) => p.activo).slice(0, 8);
  }, [productos, busqueda]);

  const total = useMemo(
    () => carrito.reduce((suma, item) => suma + item.cantidad * item.producto.precioVenta, 0),
    [carrito],
  );

  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) => (i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { producto, cantidad: 1 }];
    });
    setUltimoAgregado(producto.id);
  }

  function cambiarCantidad(idProducto: number, cantidad: number) {
    setCarrito((prev) =>
      cantidad <= 0
        ? prev.filter((i) => i.producto.id !== idProducto)
        : prev.map((i) => (i.producto.id === idProducto ? { ...i, cantidad } : i)),
    );
  }

  async function registrarVentaActual() {
    setError(null);

    if (carrito.length === 0) {
      setError('Agrega al menos un producto al carrito');
      return;
    }
    if (metodoPago === 'fiado' && !idCliente) {
      setError('Selecciona un cliente para vender a fiado');
      return;
    }

    try {
      const venta = await registrarVenta.mutateAsync({
        idCliente: idCliente || undefined,
        metodoPago,
        lineas: carrito.map((i) => ({ idProducto: i.producto.id, cantidad: i.cantidad })),
      });
      toast.exito(`Venta #${venta.id} registrada por $${venta.total.toFixed(2)}`);
      setCarrito([]);
      setMetodoPago('efectivo');
      setIdCliente('');
      setUltimoAgregado(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar la venta');
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-xl font-semibold text-ink">Punto de venta</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Input
            placeholder="Buscar producto para agregar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {productosFiltrados.map((producto) => {
              const enCarrito = carrito.find((i) => i.producto.id === producto.id);
              return (
                <button
                  key={producto.id}
                  type="button"
                  onClick={() => agregarAlCarrito(producto)}
                  className={`relative rounded-lg border-2 bg-surface p-3 text-left text-sm shadow-sm transition-all duration-150
                    hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md active:translate-y-0 active:scale-[0.98] ${
                      enCarrito ? 'border-primary-400 bg-primary-50/40' : 'border-border'
                    }`}
                >
                  {enCarrito && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-sm">
                      {enCarrito.cantidad}
                    </span>
                  )}
                  <p className="font-medium text-ink">{producto.nombre}</p>
                  <p className="text-ink-muted">${producto.precioVenta.toFixed(2)}</p>
                </button>
              );
            })}
          </div>

          {sugerencias && sugerencias.length > 0 && (
            <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-3">
              <p className="mb-2 text-xs font-medium text-primary-700">
                Clientes que compran esto tambien suelen llevar:
              </p>
              <div className="flex flex-wrap gap-2">
                {sugerencias.map((regla) => {
                  const sugerido = productos?.find((p) => p.id === regla.idProductoConsecuente);
                  if (!sugerido) return null;
                  return (
                    <button
                      key={regla.idProductoConsecuente}
                      type="button"
                      onClick={() => agregarAlCarrito(sugerido)}
                      className="rounded-full border border-primary-200 bg-surface px-3 py-1 text-xs font-medium text-primary-700
                        shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow active:translate-y-0"
                    >
                      + {sugerido.nombre} ({Math.round(regla.confianza * 100)}%)
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-ink-muted">Ventas recientes</h2>
            <VentasHistorial />
          </div>
        </div>

        <div className="h-fit overflow-hidden rounded-xl border-2 border-primary-200 bg-surface shadow-md">
          <div className="flex items-center gap-2 border-b-2 border-primary-200 bg-primary-50 px-5 py-3">
            <ShoppingCart size={18} className="text-primary-700" />
            <h2 className="font-semibold text-primary-700">Carrito</h2>
            {carrito.length > 0 && (
              <span className="ml-auto rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white">
                {carrito.reduce((n, i) => n + i.cantidad, 0)}
              </span>
            )}
          </div>

          <div className="p-5">
            {carrito.length === 0 && <p className="text-sm text-ink-muted">Agrega productos desde la izquierda.</p>}

            <ul className="flex flex-col gap-2">
              {carrito.map((item) => (
                <li key={item.producto.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex-1 text-ink">{item.producto.nombre}</span>
                  <input
                    type="number"
                    min={0}
                    value={item.cantidad}
                    onChange={(e) => cambiarCantidad(item.producto.id, Number(e.target.value))}
                    className="w-14 rounded border border-border px-2 py-1 text-center transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <span className="w-16 text-right text-ink-muted">
                    ${(item.cantidad * item.producto.precioVenta).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-semibold text-ink">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <label className="mt-4 flex flex-col gap-1 text-sm">
              <span className="font-medium text-ink">Metodo de pago</span>
              <select
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
              >
                {METODOS_PAGO.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.etiqueta}
                  </option>
                ))}
              </select>
            </label>

            {metodoPago === 'fiado' && (
              <label className="mt-3 flex flex-col gap-1 text-sm">
                <span className="font-medium text-ink">Cliente</span>
                <select
                  className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  value={idCliente}
                  onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombres}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <Button className="mt-4 w-full" disabled={registrarVenta.isPending} onClick={registrarVentaActual}>
              {registrarVenta.isPending ? 'Registrando...' : 'Registrar venta'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
