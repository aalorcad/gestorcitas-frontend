/** Formato de error devuelto por el BFF y los microservicios. */
export interface ApiError {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  details?: string[];
}
