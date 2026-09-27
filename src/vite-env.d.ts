/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  readonly VITE_ENTRA_REDIRECT_URI?: string;
  readonly VITE_ENTRA_POST_LOGOUT_REDIRECT_URI?: string;
  readonly VITE_API_SCOPE: string;
  /** Vacío = mismo origen del frontend (despliegue en AWS detrás de API Gateway). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
