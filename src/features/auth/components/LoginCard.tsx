import { Link } from 'react-router-dom';
import { Button } from '@/components';
import logo from '@/assets/logo.svg';
import { useAuth } from '../hooks/useAuth';

export function LoginCard() {
  const { login, isLoading } = useAuth();
  return (
    <div className="login-card">
      <img src={logo} alt="" width={56} height={56} />
      <h1>Gestor de Citas Médicas</h1>
      <p>Ingresa con tu cuenta para reservar y gestionar citas.</p>
      <Button onClick={() => login()} loading={isLoading} className="login-card__btn">
        Iniciar sesión
      </Button>
      <Link to="/registro" className="btn btn--secondary btn--md login-card__btn">
        Crear cuenta de paciente
      </Link>
      <small>Autenticación con Microsoft Entra ID · OAuth 2.0 / OpenID Connect · Authorization Code + PKCE</small>
    </div>
  );
}
