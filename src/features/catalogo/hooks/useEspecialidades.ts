import { useQuery } from '@tanstack/react-query';
import { especialidadesApi } from '../api/catalogoApi';

export const catalogoKeys = {
  all: ['catalogo'] as const,
  especialidades: (soloActivas: boolean) => ['catalogo', 'especialidades', soloActivas] as const,
};

export function useEspecialidades(soloActivas = true) {
  return useQuery({
    queryKey: catalogoKeys.especialidades(soloActivas),
    queryFn: () => especialidadesApi.listar(soloActivas),
  });
}
