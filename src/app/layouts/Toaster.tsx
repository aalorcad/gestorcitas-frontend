import { useNotificationStore } from '@/stores';

export function Toaster() {
  const { items, dismiss } = useNotificationStore();
  return (
    <div className="toaster" aria-live="polite">
      {items.map((n) => (
        <div key={n.id} className={`toast toast--${n.type}`} onClick={() => dismiss(n.id)}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
