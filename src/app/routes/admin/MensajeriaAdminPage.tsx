import { MensajeriaAdmin } from '@/features/mensajeria';
import { PageHeader } from '../../layouts/PageHeader';

export function MensajeriaAdminPage() {
  return (
    <>
      <PageHeader
        title="Mensajería (RabbitMQ)"
        description="Colas, exchanges y bindings del clúster. Las DLQ muestran los mensajes que no pudieron procesarse."
      />
      <MensajeriaAdmin />
    </>
  );
}
