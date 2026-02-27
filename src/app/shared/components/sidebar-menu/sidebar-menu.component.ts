import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { MenuService } from '@application/services/menu.service';
import { ROUTES } from '@core/constants/routes.constants';
import { LABELS } from '@shared/constants/labels.constants';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

@Component({
  standalone: true,
  selector: 'app-sidebar-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  private authRepo = inject(AuthRepository);
  private router = inject(Router);
  private menuService = inject(MenuService);
  private platformId = inject(PLATFORM_ID);

  readonly labels = LABELS;
  isOpen = this.menuService.isOpen;

  menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [];
    
    // Detectar rol del usuario usando Router (compatible con SSR)
    const currentUrl = this.router.url || '';
    const isAdmin = currentUrl.includes('/admin');

    if (isAdmin) {
      // Menú de Admin
      items.push(
        {
          label: this.labels.ADMIN_DASHBOARD,
          route: ROUTES.ADMIN.DASHBOARD,
          icon: 'home'
        },
        {
          label: this.labels.ANALYTICS,
          route: ROUTES.ADMIN.ANALYTICS,
          icon: 'chart'
        },
        {
          label: this.labels.CAMERAS,
          route: ROUTES.ADMIN.CAMERAS,
          icon: 'camera'
        },
        {
          label: this.labels.AI_INSIGHTS,
          route: ROUTES.ADMIN.AI_INSIGHTS,
          icon: 'ai'
        }
      );
    } else {
      // Menú de Usuario
      items.push(
        {
          label: this.labels.DASHBOARD,
          route: ROUTES.USER.DASHBOARD,
          icon: 'home'
        },
        {
          label: this.labels.PARKING_MAP,
          route: ROUTES.USER.MAP,
          icon: 'map'
        },
        {
          label: this.labels.QUEUE_STATUS,
          route: ROUTES.USER.QUEUE,
          icon: 'queue'
        },
        {
          label: this.labels.PREDICTION,
          route: ROUTES.USER.PREDICTION,
          icon: 'chart'
        },
        {
          label: this.labels.HISTORY,
          route: ROUTES.USER.HISTORY,
          icon: 'history'
        }
      );
    }
    
    return items;
  });

  toggle(): void {
    this.menuService.toggle();
  }

  close(): void {
    this.menuService.close();
  }

  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  logout(): void {
    this.authRepo.logout().subscribe(() => {
      this.router.navigate([ROUTES.AUTH.LOGIN]);
      this.close();
    });
  }
}
