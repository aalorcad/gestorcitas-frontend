import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { mensajeriaApi } from '../api/mensajeriaApi';
import type { Binding, ColaPayload, ExchangePayload, PublicarPayload } from '../types';

export const mensajeriaKeys = {
  all: ['mensajeria'] as const,
  colas: ['mensajeria', 'colas'] as const,
  exchanges: ['mensajeria', 'exchanges'] as const,
  bindings: ['mensajeria', 'bindings'] as const,
};

/** Las colas se refrescan cada 5 s para ver llegar mensajes a las DLQ durante la demo. */
export function useColas() {
  return useQuery({ queryKey: mensajeriaKeys.colas, queryFn: mensajeriaApi.listarColas, refetchInterval: 5000 });
}

export function useExchanges() {
  return useQuery({ queryKey: mensajeriaKeys.exchanges, queryFn: mensajeriaApi.listarExchanges });
}

export function useBindings() {
  return useQuery({ queryKey: mensajeriaKeys.bindings, queryFn: mensajeriaApi.listarBindings });
}

export function useMensajeriaMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const ok = (msg: string) => () => {
    notify.success(msg);
    return qc.invalidateQueries({ queryKey: mensajeriaKeys.all });
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    crearCola: useMutation({ mutationFn: (b: ColaPayload) => mensajeriaApi.crearCola(b), onSuccess: ok('Cola creada'), onError }),
    eliminarCola: useMutation({ mutationFn: (nombre: string) => mensajeriaApi.eliminarCola(nombre), onSuccess: ok('Cola eliminada'), onError }),
    purgarCola: useMutation({
      mutationFn: (nombre: string) => mensajeriaApi.purgarCola(nombre),
      onSuccess: (r) => {
        notify.success(`Se eliminaron ${r.mensajesEliminados} mensajes de ${r.cola}`);
        return qc.invalidateQueries({ queryKey: mensajeriaKeys.colas });
      },
      onError,
    }),
    crearExchange: useMutation({ mutationFn: (b: ExchangePayload) => mensajeriaApi.crearExchange(b), onSuccess: ok('Exchange creado'), onError }),
    eliminarExchange: useMutation({ mutationFn: (nombre: string) => mensajeriaApi.eliminarExchange(nombre), onSuccess: ok('Exchange eliminado'), onError }),
    crearBinding: useMutation({ mutationFn: (b: Binding) => mensajeriaApi.crearBinding(b), onSuccess: ok('Binding creado'), onError }),
    eliminarBinding: useMutation({ mutationFn: (b: Binding) => mensajeriaApi.eliminarBinding(b), onSuccess: ok('Binding eliminado'), onError }),
    publicar: useMutation({
      mutationFn: (b: PublicarPayload) => mensajeriaApi.publicar(b),
      onSuccess: (r) => {
        if (r.enrutable) notify.success(`Mensaje ${r.mensajeId.slice(0, 8)} publicado`);
        else notify.info('Mensaje publicado, pero ningún binding coincide: RabbitMQ lo descartará');
        return qc.invalidateQueries({ queryKey: mensajeriaKeys.colas });
      },
      onError,
    }),
  };
}
