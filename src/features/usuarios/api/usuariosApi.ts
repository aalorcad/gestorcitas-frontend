import { httpClient } from '@/services';
import type { AppRole } from '@/types';
import type {
  AsignarPerfilMedicoPayload,
  DashboardAdmin,
  Medico,
  PerfilMedicoPayload,
  PerfilPacientePayload,
  RegistrarMedicoPayload,
  Usuario,
} from '../types';

const BASE = '/api/usuarios';

export const usuariosApi = {
  // ---- Usuario autenticado
  sincronizar: async () => (await httpClient.post<Usuario>(`${BASE}/me/sincronizar`)).data,
  actualizarPerfilPaciente: async (body: PerfilPacientePayload) =>
    (await httpClient.put<Usuario>(`${BASE}/me/perfil-paciente`, body)).data,
  actualizarPerfilMedico: async (body: PerfilMedicoPayload) =>
    (await httpClient.put<Usuario>(`${BASE}/me/perfil-medico`, body)).data,

  // ---- Médicos para reservar
  medicos: async (especialidadId?: number) =>
    (await httpClient.get<Medico[]>(`${BASE}/medicos`, { params: especialidadId ? { especialidadId } : {} })).data,

  // ---- Administración
  listar: async (rol?: AppRole, q?: string) =>
    (await httpClient.get<Usuario[]>(BASE, { params: { ...(rol ? { rol } : {}), ...(q ? { q } : {}) } })).data,
  activar: async (id: number) => (await httpClient.patch<Usuario>(`${BASE}/${id}/activar`)).data,
  desactivar: async (id: number) => (await httpClient.patch<Usuario>(`${BASE}/${id}/desactivar`)).data,
  registrarMedico: async (body: RegistrarMedicoPayload) =>
    (await httpClient.post<Usuario>(`${BASE}/medicos`, body)).data,
  asignarPerfilMedico: async (id: number, body: AsignarPerfilMedicoPayload) =>
    (await httpClient.put<Usuario>(`${BASE}/${id}/perfil-medico`, body)).data,
  dashboard: async () => (await httpClient.get<DashboardAdmin>('/api/admin/dashboard')).data,
};
