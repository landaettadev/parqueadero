import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  // Redirect root to login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // Auth routes (sin layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // User routes (con Main Layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/user/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'map',
        loadComponent: () => import('./features/user/pages/parking-map/parking-map.component').then(m => m.ParkingMapComponent)
      },
      {
        path: 'queue',
        loadComponent: () => import('./features/user/pages/queue-status/queue-status.component').then(m => m.QueueStatusComponent)
      },
      {
        path: 'prediction',
        loadComponent: () => import('./features/user/pages/prediction/prediction.component').then(m => m.PredictionComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/user/pages/history/history.component').then(m => m.HistoryComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/user/pages/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Admin routes (con Admin Layout)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/admin/pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'cameras',
        loadComponent: () => import('./features/admin/pages/cameras/cameras.component').then(m => m.CamerasComponent)
      },
      {
        path: 'ai-insights',
        loadComponent: () => import('./features/admin/pages/ai-insights/ai-insights.component').then(m => m.AiInsightsComponent)
      }
    ]
  },

  // Wildcard
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
