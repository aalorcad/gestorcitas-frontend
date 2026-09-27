import type { ReactNode } from 'react';
import { cn } from '@/utils';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={cn('badge', `badge--${tone}`)}>{children}</span>;
}
