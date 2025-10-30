export interface Activity {
  id: string;
  tipo: 'Llamada' | 'Reunión' | 'Tarea';
  asunto: string;
  fecha: string;
  cuenta: string;
  oportunidadId?: string;
  estado: 'Pendiente' | 'Completada' | 'Pospuesta';
}
