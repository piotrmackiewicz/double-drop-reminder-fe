import { useAuthContext } from 'context/authContext';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from 'router';

export const ProtectedRoute = () => {
  const { auth } = useAuthContext();

  if (auth.currentUser) {
    return <Outlet />;
  } else {
    return <Navigate to={ROUTES.Login} replace />;
  }
};
