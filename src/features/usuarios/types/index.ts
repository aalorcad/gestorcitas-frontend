import type { AppRole } from '@/types';

export type Prevision = 'FONASA' | 'ISAPRE' | 'PARTICULAR';
export const PREVISIONES: Prevision[] = ['FONASA', 'ISAPRE', 'PARTICULAR'];

export interface PerfilPaciente {
  rut: string | null;
  fechaNacimiento: string | null;
  prevision: Prevision | null;
  completo: boolean;
}

export interface PerfilMedico {
  especialidadId: number | null;
  especialidadNombre: string | null;
  registroProfesional: string | null;
  biografia: string | null;
  especialidadAsignada: boolean;
}

export interface Usuario {
  id: number;
  oid: string | null;
  email: string;
  nombre: string;
  telefono: string | null;
  activo: boolean;
  vinculadoEntraId: boolean;
  roles: AppRole[];
  perfilPaciente: PerfilPaciente | null;
  perfilMedico: PerfilMedico | null;
  creadoEn: string;
  ultimoAcceso: string | null;
}

export interface Medico {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  especialidadId: number | null;
  especialidadNombre: string | null;
  registroProfesional: string | null;
  biografia: string | null;
  activo: boolean;
  disponible: boolean;
}

export interface PerfilPacientePayload {
  rut: string;
  fechaNacimiento: string;
  prevision: Prevision;
  telefono?: string;
}

export interface PerfilMedicoPayload {
  telefono?: string;
  biografia?: string;
}

export interface RegistrarMedicoPayload {
  nombre: string;
  email: string;
  telefono?: string;
  especialidadId: number;
  registroProfesional: string;
}

export interface AsignarPerfilMedicoPayload {
  nombre: string;
  especialidadId: number;
  registroProfesional: string;
}

export interface ResumenUsuarios {
  totalUsuarios: number;
  pacientes: number;
  medicos: number;
  administradores: number;
  medicosActivos: number;
  inactivos: number;
}

export interface ResumenCitas {
  total: number;
  pendientes: number;
  confirmadas: number;
  atendidas: number;
  canceladas: number;
  hoy: number;
}

export interface DashboardAdmin {
  usuarios: ResumenUsuarios;
  citas: ResumenCitas;
  especialidadesActivas: number;
}
