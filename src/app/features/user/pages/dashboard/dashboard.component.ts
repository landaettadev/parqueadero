import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingService } from '@application/services/parking.service';
import { LABELS } from '@shared/constants/labels.constants';
import { ROUTES } from '@core/constants/routes.constants';
import { ParkingCardComponent } from '@shared/components/parking-card/parking-card.component';
import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ParkingCardComponent,
    MetricCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private parkingService = inject(ParkingService);
  private router = inject(Router);

  readonly labels = LABELS;
  readonly routes = ROUTES;

  // Signals del servicio
  zones = this.parkingService.zones;
  totalAvailability = this.parkingService.totalAvailability;
  isLoading = this.parkingService.isLoading;

  // Computed
  isFull = computed(() => this.totalAvailability().available === 0);
  occupancyPercentage = computed(() => {
    const total = this.totalAvailability().total;
    const occupied = this.totalAvailability().occupied;
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  });

  ngOnInit(): void {
    // Cargar datos iniciales
    this.parkingService.loadZones().subscribe();
    this.parkingService.loadTotalAvailability().subscribe();
    
    // Suscribirse a actualizaciones en tiempo real
    this.parkingService.subscribeToRealtimeUpdates();
  }

  navigateToMap(): void {
    this.router.navigate([this.routes.USER.MAP]);
  }

  navigateToQueue(): void {
    this.router.navigate([this.routes.USER.QUEUE]);
  }
}
