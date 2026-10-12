import { Link } from 'react-router';

import { useCurrentUser } from 'src/entities/user';
import { LogoutButton } from 'src/features/logout';
import { ROUTES } from 'src/shared/config';

import styles from './AppHeader.module.css';

export const AppHeader = () => {
  const { data: user } = useCurrentUser();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to={ROUTES.WEBHOOKS}
          className={styles.brand}
        >
          <span
            className={styles.logo}
            aria-hidden
          />
          Smart Sender
        </Link>
        <div className={styles.user}>
          {user && (
            <span
              className={styles.name}
              title={user.email}
            >
              {user.name}
            </span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
