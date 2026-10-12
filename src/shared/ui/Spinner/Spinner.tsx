import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md';
  label?: string;
}

export const Spinner = ({ size = 'md', label }: SpinnerProps) => (
  <span
    className={[styles.spinner, styles[size]].join(' ')}
    role={label ? 'status' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  />
);
