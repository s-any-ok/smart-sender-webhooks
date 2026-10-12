import { Navigate, Outlet, useLocation } from 'react-router';

import { useSessionStatus } from 'src/entities/session';
import { ROUTES } from 'src/shared/config';
import { readFromState } from 'src/shared/lib';

export const GuestOnly = () => {
  const status = useSessionStatus();
  const location = useLocation();

  if (status === 'authenticated') {
    return (
      <Navigate
        to={readFromState(location.state, ROUTES.WEBHOOKS)}
        replace
      />
    );
  }

  return <Outlet />;
};
