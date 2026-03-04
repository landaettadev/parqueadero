import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle } from '@domain/entities/vehicle.entity';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private mockVehicles: Vehicle[] = [
    {
      id: 'v1', userId: 'user-demo', plate: 'ABC-123',
      type: 'car', brand: 'Mazda', model: 'CX-5', color: 'Blanco',
      isDefault: true, createdAt: new Date('2025-01-15')
    },
    {
      id: 'v2', userId: 'user-demo', plate: 'XYZ-789',
      type: 'motorcycle', brand: 'Yamaha', model: 'MT-03', color: 'Negro',
      isDefault: false, createdAt: new Date('2025-06-20')
    }
  ];

  vehicles = signal<Vehicle[]>(this.mockVehicles);
  isLoading = signal(false);

  defaultVehicle = computed(() => this.vehicles().find(v => v.isDefault) || null);

  loadVehicles(): Observable<Vehicle[]> {
    this.isLoading.set(true);
    setTimeout(() => { this.vehicles.set(this.mockVehicles); this.isLoading.set(false); }, 300);
    return of(this.mockVehicles);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Observable<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle, id: `v-${Date.now()}`, createdAt: new Date()
    };
    this.mockVehicles.push(newVehicle);
    this.vehicles.set([...this.mockVehicles]);
    return of(newVehicle);
  }

  removeVehicle(id: string): Observable<void> {
    this.mockVehicles = this.mockVehicles.filter(v => v.id !== id);
    this.vehicles.set([...this.mockVehicles]);
    return of(void 0);
  }

  setDefault(id: string): Observable<void> {
    this.mockVehicles = this.mockVehicles.map(v => ({ ...v, isDefault: v.id === id }));
    this.vehicles.set([...this.mockVehicles]);
    return of(void 0);
  }

  getVehicleIcon(type: string): string {
    switch (type) {
      case 'car': return 'directions_car';
      case 'motorcycle': return 'two_wheeler';
      case 'bicycle': return 'pedal_bike';
      case 'electric': return 'electric_car';
      default: return 'directions_car';
    }
  }
}
