import { DashboardAdmin } from '@/features/usuarios';
import { PageHeader } from '../../layouts/PageHeader';

export function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Panel de administración" description="Indicadores generales de la clínica" />
      <DashboardAdmin />
    </>
  );
}
