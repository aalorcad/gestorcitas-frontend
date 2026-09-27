export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'ATENDIDA';

export const ESTADOS_CITA: EstadoCita[] = ['PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'];

export interface Cita {
  id: number;
  pacienteId: string;
  pacienteNombre: string;
  pacienteEmail: string | null;
  medicoId: number;
  medicoNombre: string;
  especialidadId: number;
  especialidadNombre: string;
  fechaHora: string;
  motivo: string | null;
  estado: EstadoCita;
  observaciones: string | null;
  creadaEn: string;
}

export interface CrearCitaPayload {
  medicoId: number;
  /** ISO local sin zona: yyyy-MM-ddTHH:mm:ss */
  fechaHora: string;
  motivo?: string;
}

export interface Disponibilidad {
  medicoId: number;
  medicoNombre: string;
  fecha: string;
  horariosDisponibles: string[];
}
