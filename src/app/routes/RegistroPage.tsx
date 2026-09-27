import { Navigate } from 'react-router-dom';
import { RegistroCard, useAuth } from '@/features/auth';

export function RegistroPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return (
    <div className="login-page">
      <RegistroCard />
    </div>
  );
}
