import { Routes } from '@angular/router';
// import { authGuard } from '@infrastructure/guards/auth.guard'; // TODO: Habilitar cuando Firebase esté configurado

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/parking-map/parking-map.component').then(m => m.ParkingMapComponent)
  },
  {
    path: 'queue',
    loadComponent: () => import('./pages/queue-status/queue-status.component').then(m => m.QueueStatusComponent)
  },
  {
    path: 'prediction',
    loadComponent: () => import('./pages/prediction/prediction.component').then(m => m.PredictionComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent)
  }
];
