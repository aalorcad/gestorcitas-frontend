import { Navigate, useLocation } from 'react-router-dom';
import { LoginCard, useAuth } from '@/features/auth';

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  if (isAuthenticated) return <Navigate to={from} replace />;

  return (
    <div className="login-page">
      <LoginCard />
    </div>
  );
}
