import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  items: Notification[];
  notify: (type: NotificationType, message: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  notify: (type, message) => {
    const id = nextId++;
    set({ items: [...get().items, { id, type, message }] });
    setTimeout(() => get().dismiss(id), 5000);
  },
  dismiss: (id) => set({ items: get().items.filter((n) => n.id !== id) }),
}));
