import type { ReactNode } from 'react';
import { cn } from '@/utils';

export function Alert({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: ReactNode }) {
  return <div className={cn('alert', `alert--${tone}`)} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}
