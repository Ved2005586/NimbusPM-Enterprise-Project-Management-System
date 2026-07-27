import { useSelector } from 'react-redux';

/** Convenience hook for the current user + roles + role-check helpers. */
export default function useAuth() {
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);

  const hasRole = (role) => user?.roles?.includes(role);
  const hasAnyRole = (roles) => roles.some((r) => user?.roles?.includes(r));

  return { user, isAuthenticated, status, hasRole, hasAnyRole };
}
