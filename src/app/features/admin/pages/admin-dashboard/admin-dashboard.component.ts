import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingService } from '@application/services/parking.service';
import { QueueService } from '@application/services/queue.service';
import { AnalyticsService } from '@application/services/analytics.service';
import { LABELS } from '@shared/constants/labels.constants';
import { ROUTES } from '@core/constants/routes.constants';
import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';
import { ParkingCardComponent } from '@shared/components/parking-card/parking-card.component';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    MetricCardComponent,
    ParkingCardComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private parkingService = inject(ParkingService);
  private queueService = inject(QueueService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  readonly labels = LABELS;
  readonly routes = ROUTES;

  // Signals de servicios
  zones = this.parkingService.zones;
  totalAvailability = this.parkingService.totalAvailability;
  queueSize = this.queueService.queueSize;
  isLoading = this.parkingService.isLoading;

  // Mock data para demo
  todayEntries = 234;
  todayExits = 189;
  currentInside = computed(() => this.todayEntries - this.todayExits);

  // Computed
  occupancyPercentage = computed(() => {
    const total = this.totalAvailability().total;
    const occupied = this.totalAvailability().occupied;
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  });

  alerts = computed(() => {
    const alerts: Array<{ type: 'warning' | 'info' | 'success'; message: string }> = [];
    
    // Alerta si una zona está casi llena
    this.zones().forEach(zone => {
      const percentage = (zone.occupiedSpots / zone.totalSpots) * 100;
      if (percentage >= 95) {
        alerts.push({
          type: 'warning',
          message: `${zone.name} está al ${Math.round(percentage)}% de capacidad`
        });
      }
    });

    // Alerta si hay mucha gente en cola
    if (this.queueSize() > 10) {
      alerts.push({
        type: 'info',
        message: `${this.queueSize()} personas esperando en cola`
      });
    }

    // Mensaje positivo si hay buena disponibilidad
    if (this.totalAvailability().available > 50) {
      alerts.push({
        type: 'success',
        message: 'Buena disponibilidad en el parqueadero'
      });
    }

    return alerts;
  });

  ngOnInit(): void {
    // Cargar datos
    this.parkingService.loadZones().subscribe();
    
    // Suscribirse a actualizaciones en tiempo real
    this.parkingService.subscribeToRealtimeUpdates();
    
    // Generar datos de analítica mock
    this.analyticsService.generateMockData();
  }

  navigateToAnalytics(): void {
    this.router.navigate([this.routes.ADMIN.ANALYTICS]);
  }

  navigateToCameras(): void {
    this.router.navigate([this.routes.ADMIN.CAMERAS]);
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'success': return 'bg-green-50 border-green-500 text-green-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  }
}
