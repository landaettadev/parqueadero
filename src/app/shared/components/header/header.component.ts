import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { MenuService } from '@application/services/menu.service';
import { IMAGES } from '@shared/constants/images.constants';
import { LABELS } from '@shared/constants/labels.constants';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authRepo = inject(AuthRepository);
  private menuService = inject(MenuService);
  router = inject(Router);

  readonly images = IMAGES;
  readonly labels = LABELS;
  
  // Signal del menú desde el servicio
  isMenuOpen = this.menuService.isOpen;
  
  currentUser = computed<{ fullName: string } | null>(() => {
    return null;
  });

  get userName(): string {
    const user = this.currentUser();
    return user?.fullName || 'Usuario';
  }

  get isAuthenticated(): boolean {
    return true; // Siempre mostrar menú para MVP
  }

  toggleMenu(): void {
    this.menuService.toggle();
  }

  logout(): void {
    this.authRepo.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
