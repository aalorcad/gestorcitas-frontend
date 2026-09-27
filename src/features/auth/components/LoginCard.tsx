import { Button } from '@/components';
import logo from '@/assets/logo.svg';
import { useAuth } from '../hooks/useAuth';

export function LoginCard() {
  const { login, isLoading } = useAuth();
  return (
    <div className="login-card">
      <img src={logo} alt="" width={56} height={56} />
      <h1>Gestor de Citas Médicas</h1>
      <p>Ingresa con tu cuenta institucional de Microsoft para reservar y gestionar citas.</p>
      <Button onClick={() => login()} loading={isLoading} className="login-card__btn">
        Iniciar sesión con Microsoft
      </Button>
      <small>Autenticación con Microsoft Entra ID · OAuth 2.0 / OpenID Connect</small>
    </div>
  );
}
