import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/AuthContext';

export const AuthGuard: FC<PropsWithChildren> = () => {
  const { user } = useUser();
  if (!user && import.meta.env.PROD) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
