import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingService } from '@application/services/parking.service';
import { ReservationService } from '@application/services/reservation.service';
import { VehicleService } from '@application/services/vehicle.service';
import { QueueService } from '@application/services/queue.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private parkingService = inject(ParkingService);
  private reservationService = inject(ReservationService);
  private vehicleService = inject(VehicleService);
  private queueService = inject(QueueService);
  router = inject(Router);

  zones = this.parkingService.zones;
  totalAvailability = this.parkingService.totalAvailability;
  isLoading = this.parkingService.isLoading;
  activeReservation = this.reservationService.activeReservation;
  defaultVehicle = this.vehicleService.defaultVehicle;
  queueSize = this.queueService.queueSize;

  occupancyPercentage = computed(() => {
    const total = this.totalAvailability().total;
    const occupied = this.totalAvailability().occupied;
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  });

  availabilityColor = computed(() => {
    const pct = 100 - this.occupancyPercentage();
    if (pct > 50) return '#10b981';
    if (pct > 20) return '#f59e0b';
    return '#ef4444';
  });

  ngOnInit(): void {
    this.parkingService.loadZones().subscribe();
    this.parkingService.loadTotalAvailability().subscribe();
    this.parkingService.subscribeToRealtimeUpdates();
  }

  getZoneColor(zone: any): string {
    const pct = (zone.availableSpots / zone.totalSpots) * 100;
    if (pct > 50) return '#10b981';
    if (pct > 20) return '#f59e0b';
    return '#ef4444';
  }

  getZoneLabel(zone: any): string {
    const pct = (zone.availableSpots / zone.totalSpots) * 100;
    if (pct > 50) return 'Disponible';
    if (pct > 20) return 'Limitado';
    return 'Lleno';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
