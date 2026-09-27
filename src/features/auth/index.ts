// API pública del módulo de autenticación
export { AuthGuard } from './components/AuthGuard';
export { RoleGuard } from './components/RoleGuard';
export { RequireRole } from './components/RequireRole';
export { LoginCard } from './components/LoginCard';
export { UserMenu } from './components/UserMenu';
export { PerfilCard } from './components/PerfilCard';
export { useAuth } from './hooks/useAuth';
export { useRolesSync } from './hooks/useRolesSync';
export { usePerfil } from './hooks/usePerfil';
export type { AuthUser, Perfil } from './types';
