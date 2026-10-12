import type { ReactNode } from 'react';

import styles from './Alert.module.css';

export const Alert = ({ children }: { children: ReactNode }) => (
  <div
    role="alert"
    className={styles.alert}
  >
    {children}
  </div>
);
