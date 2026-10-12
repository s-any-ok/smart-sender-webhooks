import { useId, type ComponentProps } from 'react';

import styles from './TextField.module.css';

interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string | undefined;
}

export const TextField = ({ label, error, id, className, ...rest }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label
        htmlFor={inputId}
        className={styles.label}
      >
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles.error}
        >
          {error}
        </p>
      )}
    </div>
  );
};
