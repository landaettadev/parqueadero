import { Routes } from '@angular/router';
// import { authGuard } from '@infrastructure/guards/auth.guard'; // TODO: Habilitar cuando Firebase esté configurado
// import { roleGuard } from '@infrastructure/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'cameras',
    loadComponent: () => import('./pages/cameras/cameras.component').then(m => m.CamerasComponent)
  },
  {
    path: 'ai-insights',
    loadComponent: () => import('./pages/ai-insights/ai-insights.component').then(m => m.AiInsightsComponent)
  }
];
