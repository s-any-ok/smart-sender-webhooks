import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { WebhookTable, type Webhook, type WebhookList } from 'src/entities/webhook';
import { getErrorMessage } from 'src/shared/lib';
import { Button, Spinner, StateView } from 'src/shared/ui';

interface WebhooksListContentProps {
  query: UseQueryResult<WebhookList>;
  search: string;
  page: number;
  renderName: (webhook: Webhook) => ReactNode;
  onResetSearch: () => void;
  onFirstPage: () => void;
}

export const WebhooksListContent = ({
  query,
  search,
  page,
  renderName,
  onResetSearch,
  onFirstPage,
}: WebhooksListContentProps) => {
  const { data, error, isPending, isError, isPlaceholderData, isFetching, refetch } = query;

  if (isPending) {
    return (
      <StateView
        icon={<Spinner label="Завантаження" />}
        title="Завантажуємо вебхуки…"
      />
    );
  }

  if (isError && !data) {
    return (
      <StateView
        tone="danger"
        title="Не вдалося завантажити вебхуки"
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

  if (data.data.length === 0) {
    if (search) {
      return (
        <StateView
          title="Нічого не знайдено"
          description={`Немає вебхуків, назва яких містить «${search}».`}
          action={
            <Button
              variant="secondary"
              onClick={onResetSearch}
            >
              Скинути пошук
            </Button>
          }
        />
      );
    }
    if (page > 1) {
      return (
        <StateView
          title="Такої сторінки немає"
          description={`Усього сторінок: ${data.paging.pages.last}.`}
          action={
            <Button
              variant="secondary"
              onClick={onFirstPage}
            >
              На першу сторінку
            </Button>
          }
        />
      );
    }
    return (
      <StateView
        title="Вебхуків ще немає"
        description="Коли вони зʼявляться, ви побачите їх тут."
      />
    );
  }

  return (
    <WebhookTable
      webhooks={data.data}
      renderName={renderName}
      busy={isPlaceholderData && isFetching}
    />
  );
};
