import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../router';

export const Default = () => {
  return <Navigate to={ROUTES.Search} />;
};
