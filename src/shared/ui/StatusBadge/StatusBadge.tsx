import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const StatusBadge = ({
  active,
  activeLabel = 'Активний',
  inactiveLabel = 'Неактивний',
}: StatusBadgeProps) => (
  <span className={[styles.badge, active ? styles.active : styles.inactive].join(' ')}>
    <span
      className={styles.dot}
      aria-hidden
    />
    {active ? activeLabel : inactiveLabel}
  </span>
);
