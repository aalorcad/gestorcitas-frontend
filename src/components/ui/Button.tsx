import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="spinner spinner--inline" aria-hidden /> : icon}
      {children}
    </button>
  );
}
