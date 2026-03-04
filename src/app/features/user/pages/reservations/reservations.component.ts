import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '@application/services/reservation.service';
import { ParkingService } from '@application/services/parking.service';
import { VehicleService } from '@application/services/vehicle.service';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [CommonModule],
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent {
  private reservationService = inject(ReservationService);
  private parkingService = inject(ParkingService);
  private vehicleService = inject(VehicleService);

  reservations = this.reservationService.reservations;
  activeReservation = this.reservationService.activeReservation;
  zones = this.parkingService.zones;
  vehicles = this.vehicleService.vehicles;
  defaultVehicle = this.vehicleService.defaultVehicle;

  showNewForm = signal(false);
  selectedZone = signal('zone-a');
  selectedMinutes = signal(30);

  createReservation(): void {
    const vehicle = this.defaultVehicle();
    if (!vehicle) return;
    this.reservationService.createReservation(
      this.selectedZone(), vehicle.id, this.selectedMinutes()
    ).subscribe(() => {
      this.showNewForm.set(false);
    });
  }

  cancelReservation(id: string): void {
    this.reservationService.cancelReservation(id).subscribe();
  }

  getZoneName(zoneId: string): string {
    return this.zones().find(z => z.id === zoneId)?.name || zoneId;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmada';
      case 'ACTIVE': return 'Activa';
      case 'COMPLETED': return 'Completada';
      case 'EXPIRED': return 'Expirada';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-info';
      case 'ACTIVE': return 'badge-success';
      case 'COMPLETED': return 'badge-neutral';
      case 'EXPIRED': return 'badge-warning';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getVehicleIcon(vehicleId: string): string {
    const v = this.vehicles().find(ve => ve.id === vehicleId);
    return this.vehicleService.getVehicleIcon(v?.type || 'car');
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }
}
