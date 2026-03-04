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
  carZones = this.parkingService.carZones;
  motoZones = this.parkingService.motoZones;
  totalAvailability = this.parkingService.totalAvailability;
  carAvailability = this.parkingService.carAvailability;
  motoAvailability = this.parkingService.motoAvailability;
  isLoading = this.parkingService.isLoading;
  activeReservation = this.reservationService.activeReservation;
  defaultVehicle = this.vehicleService.defaultVehicle;
  queueSize = this.queueService.queueSize;

  readonly Math = Math;

  occupancyPercentage = computed(() => {
    const { total, occupied } = this.totalAvailability();
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  });

  carOccupancyPct = computed(() => {
    const { total, occupied } = this.carAvailability();
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  });

  motoOccupancyPct = computed(() => {
    const { total, occupied } = this.motoAvailability();
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
