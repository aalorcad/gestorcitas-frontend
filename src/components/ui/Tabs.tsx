import { cn } from '@/utils';

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: Array<{ value: T; label: string }>;
}

export function Tabs<T extends string>({ value, onChange, items }: TabsProps<T>) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={value === it.value}
          className={cn('tabs__item', value === it.value && 'tabs__item--active')}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
