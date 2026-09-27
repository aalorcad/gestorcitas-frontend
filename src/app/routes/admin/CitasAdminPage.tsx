import { CitasAdmin } from '@/features/citas';
import { PageHeader } from '../../layouts/PageHeader';

export function CitasAdminPage() {
  return (
    <>
      <PageHeader title="Administración de citas" />
      <CitasAdmin />
    </>
  );
}
