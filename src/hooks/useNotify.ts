import { useNotificationStore } from '@/stores';

/** Atajo para mostrar notificaciones (toasts). */
export function useNotify() {
  const notify = useNotificationStore((s) => s.notify);
  return {
    success: (msg: string) => notify('success', msg),
    error: (msg: string) => notify('error', msg),
    info: (msg: string) => notify('info', msg),
  };
}
