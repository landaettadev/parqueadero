import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParkingService } from '@application/services/parking.service';
import { ParkingZone } from '@domain/entities/parking-zone.entity';
import { LABELS } from '@shared/constants/labels.constants';

@Component({
  standalone: true,
  selector: 'app-parking-map',
  imports: [CommonModule],
  templateUrl: './parking-map.component.html',
  styleUrl: './parking-map.component.scss'
})
export class ParkingMapComponent implements OnInit {
  private parkingService = inject(ParkingService);
  private router = inject(Router);

  readonly labels = LABELS;
  readonly Math = Math;
  
  zones = this.parkingService.zones;
  carZones = this.parkingService.carZones;
  motoZones = this.parkingService.motoZones;
  selectedZone = signal<ParkingZone | null>(null);
  isLoading = this.parkingService.isLoading;

  ngOnInit(): void {
    this.parkingService.loadZones().subscribe();
  }

  selectZone(zone: ParkingZone): void {
    this.selectedZone.set(zone);
  }

  closeDetails(): void {
    this.selectedZone.set(null);
  }

  navigateToReserve(zoneId: string): void {
    this.router.navigate(['/reservations'], { queryParams: { zone: zoneId } });
  }

  getZoneColor(zone: ParkingZone): string {
    const percentage = (zone.availableSpots / zone.totalSpots) * 100;
    if (percentage > 50) return '#0FAB0B'; // Verde
    if (percentage > 20) return '#FFB900'; // Amarillo
    return '#A6040E'; // Rojo
  }

  getZoneStatus(zone: ParkingZone): 'available' | 'limited' | 'full' {
    const percentage = (zone.availableSpots / zone.totalSpots) * 100;
    if (percentage > 50) return 'available';
    if (percentage > 20) return 'limited';
    return 'full';
  }
}
