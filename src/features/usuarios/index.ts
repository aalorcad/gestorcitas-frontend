// API pública del módulo de usuarios (pacientes, médicos y administradores)
export { UsuarioGate } from './components/UsuarioGate';
export { PerfilIncompletoAlert } from './components/PerfilIncompletoAlert';
export { PerfilPacienteForm } from './components/PerfilPacienteForm';
export { PerfilMedicoForm } from './components/PerfilMedicoForm';
export { MedicoPicker } from './components/MedicoPicker';
export { UsuariosAdmin } from './components/UsuariosAdmin';
export { DashboardAdmin } from './components/DashboardAdmin';
export { useUsuarioActual } from './hooks/useUsuarioActual';
export { useMedicos } from './hooks/useMedicos';
export type { Usuario, Medico, PerfilPaciente, PerfilMedico } from './types';
