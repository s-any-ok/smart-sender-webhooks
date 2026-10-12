import styles from './Pagination.module.css';
import { getPageItems } from './getPageItems';

interface PaginationProps {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination = ({ page, lastPage, onChange, disabled = false }: PaginationProps) => {
  if (lastPage <= 1) return null;

  return (
    <nav
      className={styles.root}
      aria-label="Пагінація"
    >
      <button
        type="button"
        className={styles.item}
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Попередня сторінка"
      >
        ←
      </button>
      {getPageItems(page, lastPage).map((item, index) =>
        item === 'gap' ? (
          <span
            key={`gap-${index}`}
            className={styles.gap}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={styles.item}
            disabled={disabled}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => item !== page && onChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className={styles.item}
        disabled={disabled || page >= lastPage}
        onClick={() => onChange(page + 1)}
        aria-label="Наступна сторінка"
      >
        →
      </button>
    </nav>
  );
};
