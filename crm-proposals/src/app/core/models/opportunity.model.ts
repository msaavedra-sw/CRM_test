export interface Opportunity extends Record<string, unknown> {
  id: string;
  nombre: string;
  cuenta: string;
  etapa: string;
  monto: number;
  probabilidad: number;
  cierrePrevisto: string;
  propietario: string;
  fuente: string;
  territorio: string;
}
