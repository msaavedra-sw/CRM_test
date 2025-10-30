export interface Account extends Record<string, unknown> {
  id: string;
  nombre: string;
  sector: string;
  segmento: string;
  territorio: string;
  ingresosAnuales: number;
}
