import { AgendaMedico } from '@/features/citas';
import { PageHeader } from '../../layouts/PageHeader';

export function AgendaPage() {
  return (
    <>
      <PageHeader title="Agenda médica" />
      <AgendaMedico />
    </>
  );
}
