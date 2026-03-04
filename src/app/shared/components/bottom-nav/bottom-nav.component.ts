import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  standalone: true,
  selector: 'app-bottom-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav-bar">
      <div style="display: flex; align-items: center; justify-content: space-around; max-width: 500px; margin: 0 auto;">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
             style="display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 12px; border-radius: 12px; text-decoration: none; transition: all 0.2s; -webkit-tap-highlight-color: transparent; min-width: 60px;"
             [style.color]="isActive(item.route) ? '#000066' : '#9ca3af'"
             [style.background]="isActive(item.route) ? 'rgba(0,0,102,0.08)' : 'transparent'">
            <span class="mi" style="font-size: 24px;">{{ item.icon }}</span>
            <span style="font-size: 10px; font-weight: 600; letter-spacing: 0.3px;">{{ item.label }}</span>
          </a>
        }
      </div>
    </nav>
    <style>
      .bottom-nav-bar {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
        background: white; box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
        border-top: 1px solid #f3f4f6; padding: 6px 8px;
        padding-bottom: max(6px, env(safe-area-inset-bottom));
        display: block;
      }
      @media (min-width: 768px) { .bottom-nav-bar { display: none; } }
    </style>
  `
})
export class BottomNavComponent {
  private router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard' },
    { label: 'Mapa', icon: 'map', route: '/map' },
    { label: 'Camaras', icon: 'videocam', route: '/cameras' },
    { label: 'Cola', icon: 'groups', route: '/queue' },
    { label: 'Perfil', icon: 'person', route: '/profile' }
  ];

  isActive(route: string): boolean {
    return this.router.url === route || (route === '/dashboard' && this.router.url === '/');
  }
}
