import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'contained' | 'outlined' | 'text'
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const classNames = [
    styles.root,
    styles[variant],
    styles[color],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : startIcon ? (
        <span className={styles.startIcon}>{startIcon}</span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {!loading && endIcon && (
        <span className={styles.endIcon}>{endIcon}</span>
      )}
    </button>
  )
}
