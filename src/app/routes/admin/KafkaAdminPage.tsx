import { KafkaAdmin } from '@/features/kafka';
import { PageHeader } from '../../layouts/PageHeader';

export function KafkaAdminPage() {
  return (
    <>
      <PageHeader
        title="Streaming (Kafka)"
        description="Brokers del clúster, tópicos con sus particiones y réplicas, y grupos de consumidores con su lag."
      />
      <KafkaAdmin />
    </>
  );
}
