export interface Task {
    id?: number;
    titulo: string;
    descripcion: string;
    estado: 'pendiente' | 'en progreso' | 'completado';
    fecha_limite: string;
    usuario_id: number;
    archivo?: string;
  }
  