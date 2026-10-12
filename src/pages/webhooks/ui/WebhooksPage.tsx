import { WebhooksList } from 'src/widgets/webhooks-list';

import styles from './WebhooksPage.module.css';

export const WebhooksPage = () => (
  <main className={styles.page}>
    <h1 className={styles.title}>Вебхуки</h1>
    <WebhooksList />
  </main>
);
