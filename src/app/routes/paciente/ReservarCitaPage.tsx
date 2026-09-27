import { ReservaForm } from '@/features/citas';
import { PageHeader } from '../../layouts/PageHeader';

export function ReservarCitaPage() {
  return (
    <>
      <PageHeader title="Reservar cita" description="Atención de lunes a viernes, 08:00 a 18:00, en bloques de 30 minutos" />
      <ReservaForm />
    </>
  );
}
