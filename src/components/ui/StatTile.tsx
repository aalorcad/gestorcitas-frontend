import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'primary' | 'warning' | 'success' | 'danger';
}

/** Indicador numérico para dashboards. */
export function StatTile({ label, value, hint, tone = 'default' }: StatTileProps) {
  return (
    <div className={cn('stat', `stat--${tone}`)}>
      <span className="stat__label">{label}</span>
      <strong className="stat__value">{value}</strong>
      {hint && <span className="stat__hint">{hint}</span>}
    </div>
  );
}
