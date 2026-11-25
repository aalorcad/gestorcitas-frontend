import { AnaliticaPanel } from '@/features/analitica';
import { PageHeader } from '../../layouts/PageHeader';

export function AnaliticaPage() {
  return (
    <>
      <PageHeader
        title="Analítica"
        description="Indicadores calculados en tiempo real por ms-analitica a partir de los eventos de Kafka."
      />
      <AnaliticaPanel />
    </>
  );
}
