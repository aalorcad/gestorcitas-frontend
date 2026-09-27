import { AppRole } from '@/types';

export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export interface NavSection {
  rol: AppRole;
  titulo: string;
  items: NavItem[];
}

/** Menú de cada portal. Un usuario con varios roles ve varias secciones. */
export const NAV_SECTIONS: NavSection[] = [
  {
    rol: AppRole.Admin,
    titulo: 'Administración',
    items: [
      { to: '/admin', label: 'Panel', end: true },
      { to: '/admin/usuarios', label: 'Usuarios' },
      { to: '/admin/catalogo', label: 'Especialidades' },
      { to: '/admin/citas', label: 'Citas' },
    ],
  },
  {
    rol: AppRole.Medico,
    titulo: 'Portal médico',
    items: [
      { to: '/medico', label: 'Inicio', end: true },
      { to: '/medico/agenda', label: 'Mi agenda' },
      { to: '/medico/perfil', label: 'Mi perfil' },
    ],
  },
  {
    rol: AppRole.Paciente,
    titulo: 'Portal paciente',
    items: [
      { to: '/paciente', label: 'Inicio', end: true },
      { to: '/paciente/reservar', label: 'Reservar cita' },
      { to: '/paciente/mis-citas', label: 'Mis citas' },
      { to: '/paciente/perfil', label: 'Mi perfil' },
    ],
  },
];
