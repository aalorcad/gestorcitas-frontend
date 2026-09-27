import { MisCitas } from '@/features/citas';
import { PageHeader } from '../../layouts/PageHeader';

export function MisCitasPage() {
  return (
    <>
      <PageHeader title="Mis citas" />
      <MisCitas />
    </>
  );
}
