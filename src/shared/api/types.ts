export type RolUsuario = 'dueno' | 'vendedor';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface Sesion {
  token: string;
  usuario: Usuario;
}

export interface Producto {
  id: number;
  nombre: string;
  idCategoria: number;
  marca: string | null;
  codigoBarras: string | null;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  stockBajo: boolean;
  margenGanancia: number;
  activo: boolean;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'fiado';
export type EstadoVenta = 'completada' | 'anulada';

export interface LineaVenta {
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fechaHora: string;
  idCliente: number | null;
  metodoPago: MetodoPago;
  estadoVenta: EstadoVenta;
  total: number;
  lineas: LineaVenta[];
}

export interface Cliente {
  id: number;
  nombres: string;
  cedula: string | null;
  telefono: string | null;
  barrio: string | null;
  clienteFrecuente: boolean;
  limiteCredito: number;
}

export interface SaldoCliente {
  idCliente: number;
  nombres: string;
  limiteCredito: number;
  totalFiado: number;
  totalAbonado: number;
  saldoPendiente: number;
  creditoDisponible: number;
}

export type NivelRiesgo = 'Sin deuda' | 'Bajo' | 'Medio' | 'Alto' | 'Alto (excede limite)';

export interface RiesgoFiado {
  idCliente: number;
  nombres: string;
  saldoPendiente: number;
  limiteCredito: number;
  pctUtilizacionCredito: number | null;
  diasSinAbonar: number | null;
  nivelRiesgo: NivelRiesgo;
}

export interface PagoFiado {
  id: number;
  idCliente: number;
  fechaHora: string;
  monto: number;
  metodoPago: 'efectivo' | 'transferencia';
  observacion: string | null;
}

export interface ReglaAsociacion {
  idProductoAntecedente: number;
  nombreAntecedente: string | null;
  idProductoConsecuente: number;
  nombreConsecuente: string | null;
  soporte: number;
  confianza: number;
  lift: number;
  fechaCalculo: string;
}
