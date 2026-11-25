// Contratos de ms-analitica (expuesto por el BFF en /api/analitica)

export interface Conteo {
  clave: string;
  total: number;
}

export interface ResumenAnalitica {
  totalEventos: number;
  eventosPorTipo: Record<string, number>;
  reservasPorEspecialidad: Conteo[];
  reservasPorMedico: Conteo[];
  tasaCancelacion: number;
  usuarios: {
    total: number;
    activos: number;
    inactivos: number;
    porRol: Record<string, number>;
  };
  generadoEn: string;
}

export interface EventoCita {
  eventoId: string;
  tipo: string;
  citaId: number;
  medicoNombre: string | null;
  especialidadNombre: string | null;
  fechaHora: string | null;
  ocurridoEn: string;
  particion: number;
  offset: number;
  procesadoEn: string;
}
