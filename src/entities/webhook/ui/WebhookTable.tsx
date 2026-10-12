import type { ReactNode } from 'react';

import { StatusBadge } from 'src/shared/ui';

import type { Webhook } from '../model/types';
import styles from './WebhookTable.module.css';

interface WebhookTableProps {
  webhooks: Webhook[];
  renderName?: (webhook: Webhook) => ReactNode;
  busy?: boolean;
}

export const WebhookTable = ({ webhooks, renderName, busy = false }: WebhookTableProps) => (
  <div className={styles.wrapper}>
    <table
      className={styles.table}
      aria-busy={busy || undefined}
    >
      <thead>
        <tr>
          <th scope="col">Назва</th>
          <th scope="col">URL</th>
          <th
            scope="col"
            className={styles.statusCol}
          >
            Активність
          </th>
        </tr>
      </thead>
      <tbody className={busy ? styles.busy : undefined}>
        {webhooks.map((webhook) => (
          <tr key={webhook.id}>
            <td className={styles.name}>{renderName ? renderName(webhook) : webhook.name}</td>
            <td
              className={styles.url}
              title={webhook.url}
            >
              {webhook.url}
            </td>
            <td>
              <StatusBadge active={webhook.active} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
