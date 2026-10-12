import { createBrowserRouter, Navigate } from 'react-router';

import { LoginPage } from 'src/pages/login';
import { NotFoundPage } from 'src/pages/not-found';
import { WebhookEditPage } from 'src/pages/webhook-edit';
import { WebhooksPage } from 'src/pages/webhooks';
import { ROUTE_PATTERNS, ROUTES } from 'src/shared/config';

import { AppLayout } from './AppLayout';
import { GuestOnly } from './GuestOnly';
import { RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate
                to={ROUTES.WEBHOOKS}
                replace
              />
            ),
          },
          { path: ROUTES.WEBHOOKS, element: <WebhooksPage /> },
          { path: ROUTE_PATTERNS.WEBHOOK_EDIT, element: <WebhookEditPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
