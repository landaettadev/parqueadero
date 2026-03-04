export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: string;
  read: boolean;
  actionRoute?: string;
  createdAt: Date;
}
