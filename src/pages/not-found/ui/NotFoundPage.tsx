import { Link } from 'react-router';

import { ROUTES } from 'src/shared/config';
import { StateView } from 'src/shared/ui';

export const NotFoundPage = () => (
  <main>
    <StateView
      title="Сторінку не знайдено"
      action={<Link to={ROUTES.WEBHOOKS}>До списку вебхуків</Link>}
    />
  </main>
);
