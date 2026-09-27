/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  /** Solo External ID: https://<subdominio>.ciamlogin.com/ */
  readonly VITE_ENTRA_AUTHORITY?: string;
  /** "true" muestra el botón "Crear cuenta" (flujo de registro de External ID). */
  readonly VITE_ENTRA_SIGNUP?: string;
  /** Rol para usuarios sin App Roles (autoregistro), ej. Paciente. */
  readonly VITE_DEFAULT_ROLE?: string;
  readonly VITE_ENTRA_REDIRECT_URI?: string;
  readonly VITE_ENTRA_POST_LOGOUT_REDIRECT_URI?: string;
  readonly VITE_API_SCOPE: string;
  /** Vacío = mismo origen del frontend (despliegue en AWS detrás de API Gateway). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
