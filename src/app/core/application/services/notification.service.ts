import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '@domain/entities/notification.entity';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private mockNotifications: AppNotification[] = [
    {
      id: 'n1', userId: 'user-demo', title: 'Reserva confirmada',
      message: 'Tu espacio A-12 está reservado para las 3:30 PM',
      type: 'success', icon: 'check_circle', read: false, actionRoute: '/dashboard',
      createdAt: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 'n2', userId: 'user-demo', title: 'Zona A casi llena',
      message: 'Solo quedan 3 espacios disponibles en Zona A',
      type: 'warning', icon: 'warning', read: false, actionRoute: '/map',
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 'n3', userId: 'user-demo', title: 'Bienvenido al sistema',
      message: 'Tu cuenta ha sido verificada con el correo institucional',
      type: 'info', icon: 'info', read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  notifications = signal<AppNotification[]>(this.mockNotifications);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  markAsRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): void {
    const newNotif: AppNotification = {
      ...notification, id: `n-${Date.now()}`, read: false, createdAt: new Date()
    };
    this.notifications.update(list => [newNotif, ...list]);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }
}
