import { Navigate, Outlet, useLocation } from 'react-router';

import { useSessionEndReason, useSessionStatus } from 'src/entities/session';
import { ROUTES } from 'src/shared/config';
import { createFromState } from 'src/shared/lib';

export const RequireAuth = () => {
  const status = useSessionStatus();
  const endReason = useSessionEndReason();
  const location = useLocation();

  if (status !== 'authenticated') {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={endReason === 'logout' ? undefined : createFromState(location)}
      />
    );
  }

  return <Outlet />;
};
