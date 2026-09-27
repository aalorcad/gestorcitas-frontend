import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { citasApi } from '../api/citasApi';
import type { CrearCitaPayload } from '../types';
import { citasKeys } from './useCitasQueries';

export function useCitaMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const ok = (msg: string) => () => {
    notify.success(msg);
    return qc.invalidateQueries({ queryKey: citasKeys.all });
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    reservar: useMutation({
      mutationFn: (body: CrearCitaPayload) => citasApi.reservar(body),
      onSuccess: ok('¡Cita reservada! Quedó en estado PENDIENTE.'),
      onError,
    }),
    cancelar: useMutation({
      mutationFn: (id: number) => citasApi.cancelar(id),
      onSuccess: ok('Cita cancelada'),
      onError,
    }),
    confirmar: useMutation({
      mutationFn: (id: number) => citasApi.confirmar(id),
      onSuccess: ok('Cita confirmada'),
      onError,
    }),
    atender: useMutation({
      mutationFn: ({ id, observaciones }: { id: number; observaciones?: string }) => citasApi.atender(id, observaciones),
      onSuccess: ok('Atención registrada'),
      onError,
    }),
  };
}
