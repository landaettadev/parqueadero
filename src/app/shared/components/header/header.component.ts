import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '@application/services/menu.service';
import { NotificationService } from '@application/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private menuService = inject(MenuService);
  private notifService = inject(NotificationService);
  router = inject(Router);

  isMenuOpen = this.menuService.isOpen;
  unreadCount = this.notifService.unreadCount;
  showNotifPanel = signal(false);
  notifications = this.notifService.notifications;

  toggleMenu(): void {
    this.menuService.toggle();
  }

  toggleNotifications(): void {
    this.showNotifPanel.update(v => !v);
    if (this.showNotifPanel()) {
      this.notifService.markAllAsRead();
    }
  }

  getTimeAgo(date: Date): string {
    return this.notifService.getTimeAgo(date);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.showNotifPanel.set(false);
  }
}
