import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '@application/services/vehicle.service';
import { Vehicle } from '@domain/entities/vehicle.entity';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  vehicles = this.vehicleService.vehicles;
  isLoading = this.vehicleService.isLoading;
  showAddForm = signal(false);
  newPlate = signal('');
  newType = signal<'car' | 'motorcycle' | 'bicycle' | 'electric'>('car');

  user = {
    name: 'Juan Perez',
    email: 'juan.perez@eafit.edu.co',
    role: 'Estudiante',
    carnet: '202510001',
    since: 'Enero 2025'
  };

  getVehicleIcon(type: string): string {
    return this.vehicleService.getVehicleIcon(type);
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'car': return 'Carro';
      case 'motorcycle': return 'Moto';
      case 'bicycle': return 'Bicicleta';
      case 'electric': return 'Electrico';
      default: return type;
    }
  }

  setDefault(id: string): void {
    this.vehicleService.setDefault(id).subscribe();
  }

  removeVehicle(id: string): void {
    this.vehicleService.removeVehicle(id).subscribe();
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
  }

  addVehicle(): void {
    if (!this.newPlate()) return;
    this.vehicleService.addVehicle({
      userId: 'user-demo',
      plate: this.newPlate().toUpperCase(),
      type: this.newType(),
      isDefault: this.vehicles().length === 0
    }).subscribe(() => {
      this.newPlate.set('');
      this.showAddForm.set(false);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }
}
