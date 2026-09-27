import { PerfilCard } from '@/features/auth';
import { PageHeader } from '../layouts/PageHeader';

export function SesionPage() {
  return (
    <>
      <PageHeader title="Sesión" description="Detalle del access token validado por API Gateway y el BFF" />
      <PerfilCard />
    </>
  );
}
