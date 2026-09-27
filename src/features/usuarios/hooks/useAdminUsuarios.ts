import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import type { AppRole } from '@/types';
import { getErrorMessage } from '@/utils';
import { usuariosApi } from '../api/usuariosApi';
import type { AsignarPerfilMedicoPayload, RegistrarMedicoPayload } from '../types';
import { usuariosKeys } from './useUsuarioActual';

export function useUsuariosAdmin(rol?: AppRole, q?: string) {
  return useQuery({
    queryKey: usuariosKeys.admin(rol, q),
    queryFn: () => usuariosApi.listar(rol, q),
  });
}

export function useDashboardAdmin() {
  return useQuery({ queryKey: usuariosKeys.dashboard, queryFn: usuariosApi.dashboard });
}

/** Acciones del Admin sobre usuarios y médicos. */
export function useAdminUsuarioMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const ok = (msg: string) => () => {
    notify.success(msg);
    return qc.invalidateQueries({ queryKey: usuariosKeys.all });
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    toggleActivo: useMutation({
      mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
        activo ? usuariosApi.desactivar(id) : usuariosApi.activar(id),
      onSuccess: ok('Estado del usuario actualizado'),
      onError,
    }),
    registrarMedico: useMutation({
      mutationFn: (body: RegistrarMedicoPayload) => usuariosApi.registrarMedico(body),
      onSuccess: ok('Médico registrado. Se vinculará a Entra ID en su primer inicio de sesión.'),
      onError,
    }),
    asignarPerfilMedico: useMutation({
      mutationFn: ({ id, body }: { id: number; body: AsignarPerfilMedicoPayload }) =>
        usuariosApi.asignarPerfilMedico(id, body),
      onSuccess: ok('Datos del médico actualizados'),
      onError,
    }),
  };
}
