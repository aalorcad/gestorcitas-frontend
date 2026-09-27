import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { especialidadesApi } from '../api/catalogoApi';
import type { EspecialidadPayload } from '../types';
import { catalogoKeys } from './useEspecialidades';

/** Mutaciones de administración del catálogo (solo rol Admin). */
export function useCatalogoMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const onSuccess = (msg: string) => () => {
    notify.success(msg);
    return qc.invalidateQueries({ queryKey: catalogoKeys.all });
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    guardarEspecialidad: useMutation({
      mutationFn: ({ id, body }: { id?: number; body: EspecialidadPayload }) =>
        id ? especialidadesApi.actualizar(id, body) : especialidadesApi.crear(body),
      onSuccess: onSuccess('Especialidad guardada'),
      onError,
    }),
    toggleEspecialidad: useMutation({
      mutationFn: ({ id, activa }: { id: number; activa: boolean }) =>
        activa ? especialidadesApi.desactivar(id) : especialidadesApi.activar(id),
      onSuccess: onSuccess('Estado de la especialidad actualizado'),
      onError,
    }),
  };
}
