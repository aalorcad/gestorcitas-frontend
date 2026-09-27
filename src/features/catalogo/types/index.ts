export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
  valorConsulta: number;
  activa: boolean;
}

export interface EspecialidadPayload {
  nombre: string;
  descripcion?: string;
  valorConsulta: number;
}
