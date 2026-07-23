export class ApiError extends Error {
  readonly statusCode: number;
  readonly detalles?: string[];

  constructor(message: string, statusCode: number, detalles?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detalles = detalles;
  }
}
