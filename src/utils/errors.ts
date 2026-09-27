import axios from 'axios';
import type { ApiError } from '@/types';

/** Extrae un mensaje legible desde un error de Axios / BFF. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.details?.length) return `${data.message}: ${data.details.join(', ')}`;
    if (data?.message) return data.message;
    if (error.response?.status === 401) return 'Tu sesión expiró o el token no es válido.';
    if (error.response?.status === 403) return 'No tienes permisos para esta operación.';
    if (!error.response) return 'No fue posible conectar con el servidor.';
    return `Error ${error.response.status}`;
  }
  if (error instanceof Error) return error.message;
  return 'Error inesperado';
}
