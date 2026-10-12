import { useSessionEndReason } from 'src/entities/session';
import { LoginForm } from 'src/features/auth-by-email';
import { MOCK_USER } from 'src/shared/mocks/config';
import { Alert } from 'src/shared/ui';

import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const endReason = useSessionEndReason();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вхід</h1>
        <p className={styles.subtitle}>Керування вебхуками Smart Sender</p>
        {endReason === 'expired' && (
          <div className={styles.notice}>
            <Alert>Сесія завершилась. Увійдіть знову.</Alert>
          </div>
        )}
        <LoginForm />
        <p className={styles.hint}>
          Тестовий доступ: <code>{MOCK_USER.email}</code> / <code>{MOCK_USER.password}</code>
        </p>
      </div>
    </main>
  );
};
