import type { FormEvent } from 'react';

import { useSearchDraft } from '../model/useSearchDraft';
import styles from './WebhookSearch.module.css';

interface WebhookSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const WebhookSearch = ({ value, onChange }: WebhookSearchProps) => {
  const { draft, onChange: onDraftChange, flush } = useSearchDraft(value, onChange);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    flush();
  };

  return (
    <form
      role="search"
      className={styles.form}
      onSubmit={onSubmit}
    >
      <input
        type="search"
        className={styles.input}
        placeholder="Пошук за назвою…"
        aria-label="Пошук вебхуків за назвою"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
      />
    </form>
  );
};
