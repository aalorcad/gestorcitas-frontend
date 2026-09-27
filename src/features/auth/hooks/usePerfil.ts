import { useQuery } from '@tanstack/react-query';
import { perfilApi } from '../api/perfilApi';

export function usePerfil() {
  return useQuery({ queryKey: ['perfil'], queryFn: perfilApi.obtener });
}
