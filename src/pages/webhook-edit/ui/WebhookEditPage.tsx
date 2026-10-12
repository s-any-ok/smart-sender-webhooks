import { useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';

import { useWebhook } from 'src/entities/webhook';
import { EditWebhookForm } from 'src/features/edit-webhook';
import { isApiError } from 'src/shared/api';
import { ROUTES } from 'src/shared/config';
import { getErrorMessage, parsePositiveInt, readFromState } from 'src/shared/lib';
import { Button, Spinner, StateView } from 'src/shared/ui';

import styles from './WebhookEditPage.module.css';

const INVALID_ID = 0;

export const WebhookEditPage = () => {
  const { id: rawId } = useParams();
  const id = parsePositiveInt(rawId, INVALID_ID);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = readFromState(location.state, ROUTES.WEBHOOKS);

  const { data: webhook, error, isPending, isError, refetch } = useWebhook(id);
  const goBack = useCallback(() => navigate(backTo), [navigate, backTo]);

  const isNotFound = id === INVALID_ID || (isApiError(error) && error.status === 404);

  const renderBody = () => {
    if (isNotFound) {
      return (
        <StateView
          title="Вебхук не знайдено"
          description="Можливо, його видалили або посилання некоректне."
          action={<Link to={backTo}>До списку вебхуків</Link>}
        />
      );
    }
    if (isPending) {
      return (
        <StateView
          icon={<Spinner label="Завантаження" />}
          title="Завантажуємо вебхук…"
        />
      );
    }
    if (isError) {
      return (
        <StateView
          tone="danger"
          title="Не вдалося завантажити вебхук"
          description={getErrorMessage(error)}
          action={
            <Button
              variant="secondary"
              onClick={() => refetch()}
            >
              Спробувати ще раз
            </Button>
          }
        />
      );
    }
    return (
      <EditWebhookForm
        key={webhook.id}
        webhook={webhook}
        onSaved={goBack}
        onCancel={goBack}
      />
    );
  };

  return (
    <main className={styles.page}>
      <Link
        to={backTo}
        className={styles.back}
      >
        ← Вебхуки
      </Link>
      <h1 className={styles.title}>Редагування вебхука</h1>
      <section className={styles.card}>{renderBody()}</section>
    </main>
  );
};
