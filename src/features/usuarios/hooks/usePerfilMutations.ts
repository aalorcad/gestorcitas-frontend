import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { usuariosApi } from '../api/usuariosApi';
import type { PerfilMedicoPayload, PerfilPacientePayload, Usuario } from '../types';
import { usuariosKeys } from './useUsuarioActual';

/** Edición del perfil propio (Paciente o Médico). */
export function usePerfilMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const onSuccess = (usuario: Usuario) => {
    qc.setQueryData(usuariosKeys.actual, usuario);
    notify.success('Perfil actualizado');
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    guardarPaciente: useMutation({
      mutationFn: (body: PerfilPacientePayload) => usuariosApi.actualizarPerfilPaciente(body),
      onSuccess,
      onError,
    }),
    guardarMedico: useMutation({
      mutationFn: (body: PerfilMedicoPayload) => usuariosApi.actualizarPerfilMedico(body),
      onSuccess,
      onError,
    }),
  };
}
