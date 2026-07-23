import { useMemo, useState } from 'react';
import { useCategorias } from '../categorias/hooks';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { EstadoError, EstadoVacio, Spinner } from '../../shared/ui/EstadoCarga';
import { Input } from '../../shared/ui/Input';
import type { Producto } from '../../shared/api/types';
import { ProductoFormModal } from './ProductoFormModal';
import { useProductos } from './hooks';

export function ProductosPage() {
  const { data: productos, isLoading, isError } = useProductos();
  const { data: categorias } = useCategorias();
  const [busqueda, setBusqueda] = useState('');
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null | undefined>(undefined);

  const nombreCategoria = useMemo(() => {
    const mapa = new Map(categorias?.map((c) => [c.id, c.nombre]));
    return (idCategoria: number) => mapa.get(idCategoria) ?? '—';
  }, [categorias]);

  const productosFiltrados = useMemo(() => {
    if (!productos) return [];
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return productos;
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(texto) || p.marca?.toLowerCase().includes(texto),
    );
  }, [productos, busqueda]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Productos</h1>
          <p className="text-sm text-ink-muted">Catalogo, precios y stock de la tienda</p>
        </div>
        <Button onClick={() => setProductoEnEdicion(null)}>Nuevo producto</Button>
      </div>

      <div className="mb-4 max-w-xs">
        <Input placeholder="Buscar por nombre o marca..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-10 text-ink-muted">
          <Spinner />
        </div>
      )}
      {isError && <EstadoError mensaje="No se pudieron cargar los productos." />}
      {!isLoading && !isError && productosFiltrados.length === 0 && <EstadoVacio mensaje="No hay productos que coincidan." />}

      {!isLoading && productosFiltrados.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Precio venta</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-b border-border transition-colors duration-150 last:border-0 hover:bg-surface-alt/60"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{producto.nombre}</p>
                    {producto.marca && <p className="text-xs text-ink-muted">{producto.marca}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{nombreCategoria(producto.idCategoria)}</td>
                  <td className="px-4 py-3 text-ink">${producto.precioVenta.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-ink">{producto.stockActual}</span>
                      {producto.stockBajo && <Badge tono="peligro">Stock bajo</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variante="fantasma" onClick={() => setProductoEnEdicion(producto)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {productoEnEdicion !== undefined && (
        <ProductoFormModal producto={productoEnEdicion} onCerrar={() => setProductoEnEdicion(undefined)} />
      )}
    </div>
  );
}
