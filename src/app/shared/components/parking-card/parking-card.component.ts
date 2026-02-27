import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingStatus } from '@domain/value-objects/parking-status.vo';

@Component({
  standalone: true,
  selector: 'app-parking-card',
  imports: [CommonModule],
  templateUrl: './parking-card.component.html',
  styleUrl: './parking-card.component.scss'
})
export class ParkingCardComponent {
  // Inputs
  zone = input.required<string>();
  available = input.required<number>();
  total = input.required<number>();
  
  // Computed
  status = computed(() => {
    const parkingStatus = new ParkingStatus(this.available(), this.total());
    return parkingStatus.status;
  });

  percentage = computed(() => {
    const parkingStatus = new ParkingStatus(this.available(), this.total());
    return Math.round(parkingStatus.occupancyPercentage);
  });

  availablePercentage = computed(() => {
    return Math.round((this.available() / this.total()) * 100);
  });

  statusColor = computed(() => {
    const status = this.status();
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'limited':
        return 'bg-yellow-500';
      case 'full':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  });

  statusText = computed(() => {
    const status = this.status();
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'limited':
        return 'Limitado';
      case 'full':
        return 'Lleno';
      default:
        return 'Desconocido';
    }
  });
}
