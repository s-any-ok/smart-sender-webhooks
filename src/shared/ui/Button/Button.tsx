import type { ComponentProps } from 'react';

import { Spinner } from '../Spinner/Spinner';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);
