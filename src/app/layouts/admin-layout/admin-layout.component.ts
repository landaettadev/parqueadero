import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { SidebarMenuComponent } from '@shared/components/sidebar-menu/sidebar-menu.component';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarMenuComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {}
