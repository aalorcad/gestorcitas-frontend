import { EspecialidadesAdmin } from '@/features/catalogo';
import { PageHeader } from '../../layouts/PageHeader';

export function CatalogoAdminPage() {
  return (
    <>
      <PageHeader title="Catálogo de especialidades" description="Especialidades disponibles para reserva y valor de la consulta" />
      <EspecialidadesAdmin />
    </>
  );
}
