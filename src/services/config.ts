/**
 * URLs públicas de la aplicación.
 *
 * En AWS el frontend y la API se publican en el MISMO dominio de API Gateway
 * (https://xxxx.execute-api...amazonaws.com):
 *   /        -> frontend (nginx en EC2)
 *   /api/*   -> BFF (EC2), protegido con JWT
 * Por eso, si una variable no se define al compilar, se usa el origen actual del navegador.
 * En desarrollo con `npm run dev` se definen en frontend/.env (API en http://localhost:8080).
 */
const env = import.meta.env;
const origin = window.location.origin;

export const APP_ORIGIN = origin;
export const API_BASE_URL = env.VITE_API_BASE_URL || origin;
export const REDIRECT_URI = env.VITE_ENTRA_REDIRECT_URI || origin;
export const POST_LOGOUT_REDIRECT_URI = env.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI || `${origin}/login`;
