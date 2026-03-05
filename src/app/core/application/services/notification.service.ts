import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '@domain/entities/notification.entity';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private mockNotifications: AppNotification[] = [
    {
      id: 'n1', userId: 'user-demo', title: 'Entrada Las Hermosas llena',
      message: 'La entrada 3 (Las Hermosas) está al 95% de capacidad',
      type: 'warning', icon: 'warning', read: false, actionRoute: '/map',
      createdAt: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 'n2', userId: 'user-demo', title: 'Tu turno se acerca',
      message: 'Estás en la posición #2 en Entrada 1 — Las Vegas',
      type: 'info', icon: 'groups', read: false, actionRoute: '/queue',
      createdAt: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: 'n3', userId: 'user-demo', title: 'Entrada La Regional cerrada',
      message: 'La entrada 4 (La Regional) está temporalmente cerrada por mantenimiento',
      type: 'warning', icon: 'block', read: false, actionRoute: '/map',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'n4', userId: 'user-demo', title: 'Espacios disponibles en Idiomas',
      message: '50 espacios libres en Entrada 6 — Idiomas',
      type: 'success', icon: 'check_circle', read: true, actionRoute: '/map',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'n5', userId: 'user-demo', title: 'Bienvenido al sistema',
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
