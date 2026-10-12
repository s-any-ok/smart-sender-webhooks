import type { ReactNode } from 'react';

import styles from './StateView.module.css';

interface StateViewProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
}

export const StateView = ({
  title,
  description,
  icon,
  action,
  tone = 'neutral',
}: StateViewProps) => (
  <div
    className={[styles.root, styles[tone]].join(' ')}
    role={tone === 'danger' ? 'alert' : undefined}
  >
    {icon && <div className={styles.icon}>{icon}</div>}
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
