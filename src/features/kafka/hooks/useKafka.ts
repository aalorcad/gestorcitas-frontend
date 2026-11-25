import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotify } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { kafkaApi } from '../api/kafkaApi';
import type { CrearTopicoPayload, ReiniciarOffsetsPayload } from '../types';

export const kafkaKeys = {
  all: ['kafka'] as const,
  cluster: ['kafka', 'cluster'] as const,
  topicos: ['kafka', 'topicos'] as const,
  topico: (nombre: string) => ['kafka', 'topicos', nombre] as const,
  grupos: ['kafka', 'grupos'] as const,
  grupo: (grupo: string) => ['kafka', 'grupos', grupo] as const,
};

/** El estado del clúster se refresca cada 10 s (para ver caer/volver un broker durante la demo). */
export function useCluster() {
  return useQuery({ queryKey: kafkaKeys.cluster, queryFn: kafkaApi.cluster, refetchInterval: 10000 });
}

export function useTopicos() {
  return useQuery({ queryKey: kafkaKeys.topicos, queryFn: kafkaApi.listarTopicos });
}

/** Detalle con offsets: se refresca cada 5 s para ver crecer los registros. */
export function useTopico(nombre: string | null) {
  return useQuery({
    queryKey: kafkaKeys.topico(nombre ?? ''),
    queryFn: () => kafkaApi.obtenerTopico(nombre as string),
    enabled: !!nombre,
    refetchInterval: 5000,
  });
}

export function useGrupos() {
  return useQuery({ queryKey: kafkaKeys.grupos, queryFn: kafkaApi.listarGrupos, refetchInterval: 10000 });
}

/** Detalle con lag: se refresca cada 5 s para ver cómo los consumidores lo reducen. */
export function useGrupo(grupo: string | null) {
  return useQuery({
    queryKey: kafkaKeys.grupo(grupo ?? ''),
    queryFn: () => kafkaApi.obtenerGrupo(grupo as string),
    enabled: !!grupo,
    refetchInterval: 5000,
  });
}

export function useKafkaMutations() {
  const qc = useQueryClient();
  const notify = useNotify();

  const ok = (msg: string) => () => {
    notify.success(msg);
    return qc.invalidateQueries({ queryKey: kafkaKeys.all });
  };
  const onError = (e: unknown) => notify.error(getErrorMessage(e));

  return {
    crearTopico: useMutation({
      mutationFn: (b: CrearTopicoPayload) => kafkaApi.crearTopico(b),
      onSuccess: ok('Tópico creado'),
      onError,
    }),
    actualizarConfiguracion: useMutation({
      mutationFn: (v: { nombre: string; configuracion: Record<string, string> }) =>
        kafkaApi.actualizarConfiguracion(v.nombre, v.configuracion),
      onSuccess: ok('Configuración actualizada'),
      onError,
    }),
    aumentarParticiones: useMutation({
      mutationFn: (v: { nombre: string; total: number }) => kafkaApi.aumentarParticiones(v.nombre, v.total),
      onSuccess: ok('Particiones aumentadas'),
      onError,
    }),
    eliminarTopico: useMutation({
      mutationFn: (nombre: string) => kafkaApi.eliminarTopico(nombre),
      onSuccess: ok('Tópico eliminado'),
      onError,
    }),
    reiniciarOffsets: useMutation({
      mutationFn: (v: { grupo: string; body: ReiniciarOffsetsPayload }) => kafkaApi.reiniciarOffsets(v.grupo, v.body),
      onSuccess: (r) => {
        notify.success(`Offsets de ${r.grupo} reiniciados (${r.estrategia})`);
        return qc.invalidateQueries({ queryKey: kafkaKeys.all });
      },
      onError,
    }),
    eliminarGrupo: useMutation({
      mutationFn: (grupo: string) => kafkaApi.eliminarGrupo(grupo),
      onSuccess: ok('Grupo eliminado'),
      onError,
    }),
  };
}
