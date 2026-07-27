import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/** Blocks access to nested routes unless the user holds one of `allowedRoles`. */
export default function RoleRoute({ allowedRoles }) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
