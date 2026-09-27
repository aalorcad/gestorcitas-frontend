/** Valores de los App Roles definidos en la App Registration de la API (Entra ID). */
export const AppRole = {
  Paciente: 'Paciente',
  Medico: 'Medico',
  Admin: 'Admin',
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];
