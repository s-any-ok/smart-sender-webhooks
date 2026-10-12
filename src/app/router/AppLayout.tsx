import { Outlet } from 'react-router';

import { AppHeader } from 'src/widgets/app-header';

export const AppLayout = () => (
  <>
    <AppHeader />
    <Outlet />
  </>
);
