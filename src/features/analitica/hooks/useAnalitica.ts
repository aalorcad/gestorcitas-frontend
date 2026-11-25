import { useQuery } from '@tanstack/react-query';
import { analiticaApi } from '../api/analiticaApi';

/** Se refresca cada 5 s: al reservar o cancelar una cita, el evento llega por Kafka y el indicador cambia. */
export function useResumenAnalitica() {
  return useQuery({ queryKey: ['analitica', 'resumen'], queryFn: analiticaApi.resumen, refetchInterval: 5000 });
}

export function useUltimosEventos(limite = 20) {
  return useQuery({
    queryKey: ['analitica', 'eventos', limite],
    queryFn: () => analiticaApi.ultimosEventos(limite),
    refetchInterval: 5000,
  });
}
