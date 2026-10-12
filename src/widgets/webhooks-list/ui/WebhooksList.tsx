import { Link, useLocation } from 'react-router';

import { useWebhooks, type Webhook } from 'src/entities/webhook';
import { useWebhookListParams, WebhookSearch } from 'src/features/webhook-filters';
import { ROUTES, WEBHOOKS_PAGE_SIZE } from 'src/shared/config';
import { createFromState } from 'src/shared/lib';
import { Pagination } from 'src/shared/ui';

import styles from './WebhooksList.module.css';
import { WebhooksListContent } from './WebhooksListContent';

export const WebhooksList = () => {
  const location = useLocation();
  const { page, search, setPage, setSearch } = useWebhookListParams();
  const query = useWebhooks({ page, search, limit: WEBHOOKS_PAGE_SIZE });
  const { data, isPlaceholderData } = query;

  const renderName = (webhook: Webhook) => (
    <Link
      to={ROUTES.webhookEdit(webhook.id)}
      state={createFromState(location)}
      className={styles.link}
    >
      {webhook.name}
    </Link>
  );

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <WebhookSearch
          value={search}
          onChange={setSearch}
        />
        {data && (
          <span className={styles.total}>
            Знайдено: <strong>{data.paging.results.total}</strong>
          </span>
        )}
      </div>

      <WebhooksListContent
        query={query}
        search={search}
        page={page}
        renderName={renderName}
        onResetSearch={() => setSearch('')}
        onFirstPage={() => setPage(1)}
      />

      {data && data.data.length > 0 && (
        <div className={styles.footer}>
          <Pagination
            page={page}
            lastPage={data.paging.pages.last}
            onChange={setPage}
            disabled={isPlaceholderData}
          />
        </div>
      )}
    </section>
  );
};
