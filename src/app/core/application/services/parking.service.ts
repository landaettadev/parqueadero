import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ParkingZone } from '@domain/entities/parking-zone.entity';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  // 6 entradas de carro + 3 de moto (EAFIT)
  private mockZones: ParkingZone[] = [
    // === CARROS — 6 entradas ===
    {
      id: 'car-1', name: 'Entrada 1 — Las Vegas', entrance: 1,
      description: 'Entrada 1 · Las Vegas',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 100, availableSpots: 0,
      status: 'full', location: { lat: 6.2006, lng: -75.5783 }
    },
    {
      id: 'car-2', name: 'Entrada 2 — Las Vegas (Empleados)', entrance: 2,
      description: 'Entrada 2 · Las Vegas (Empleados)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 60, availableSpots: 40,
      status: 'available', location: { lat: 6.2010, lng: -75.5790 }
    },
    {
      id: 'car-3', name: 'Entrada 3 — Las Hermosas (Regional)', entrance: 3,
      description: 'Entrada 3 · Las Hermosas (Regional)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 95, availableSpots: 5,
      status: 'limited', location: { lat: 6.1998, lng: -75.5775 }
    },
    {
      id: 'car-4', name: 'Entrada 4 — Aguacatala', entrance: 4,
      description: 'Entrada 4 · Aguacatala',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 100, availableSpots: 0,
      status: 'full', location: { lat: 6.1995, lng: -75.5770 }
    },
    {
      id: 'car-5', name: 'Entrada 5 — 4 Sur', entrance: 5,
      description: 'Entrada 5 · 4 Sur',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 72, availableSpots: 28,
      status: 'available', location: { lat: 6.2014, lng: -75.5786 }
    },
    {
      id: 'car-6', name: 'Entrada 6 — Idiomas', entrance: 6,
      description: 'Entrada 6 · Idiomas',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 50, availableSpots: 50,
      status: 'available', location: { lat: 6.2001, lng: -75.5780 }
    },
    // === MOTOS — 3 entradas ===
    {
      id: 'moto-1', name: 'Entrada 1 — Las Vegas', entrance: 1,
      description: 'Entrada 1 · Las Vegas',
      vehicleType: 'motorcycle', totalSpots: 80, occupiedSpots: 78, availableSpots: 2,
      status: 'limited', location: { lat: 6.2007, lng: -75.5782 }
    },
    {
      id: 'moto-2', name: 'Entrada 2 — La Regional', entrance: 2,
      description: 'Entrada 2 · La Regional',
      vehicleType: 'motorcycle', totalSpots: 80, occupiedSpots: 78, availableSpots: 2,
      status: 'limited', location: { lat: 6.2011, lng: -75.5791 }
    },
    {
      id: 'moto-3', name: 'Entrada 3 — Idiomas', entrance: 3,
      description: 'Entrada 3 · Idiomas',
      vehicleType: 'motorcycle', totalSpots: 80, occupiedSpots: 20, availableSpots: 60,
      status: 'available', location: { lat: 6.1996, lng: -75.5773 }
    }
  ];

  // Signals para estado reactivo
  zones = signal<ParkingZone[]>(this.mockZones);
  isLoading = signal(false);

  carZones = computed(() => this.zones().filter(z => z.vehicleType === 'car'));
  motoZones = computed(() => this.zones().filter(z => z.vehicleType === 'motorcycle'));

  totalAvailability = computed(() => {
    const all = this.zones();
    const total = all.reduce((s, z) => s + z.totalSpots, 0);
    const occupied = all.reduce((s, z) => s + z.occupiedSpots, 0);
    return { total, occupied, available: total - occupied };
  });

  carAvailability = computed(() => {
    const zones = this.carZones();
    const total = zones.reduce((s, z) => s + z.totalSpots, 0);
    const occupied = zones.reduce((s, z) => s + z.occupiedSpots, 0);
    return { total, occupied, available: total - occupied };
  });

  motoAvailability = computed(() => {
    const zones = this.motoZones();
    const total = zones.reduce((s, z) => s + z.totalSpots, 0);
    const occupied = zones.reduce((s, z) => s + z.occupiedSpots, 0);
    return { total, occupied, available: total - occupied };
  });

  constructor() {
    // Inicializar con datos mock
    this.loadZones().subscribe();
  }

  /**
   * Obtener todas las zonas de parqueo (mock)
   */
  loadZones(): Observable<ParkingZone[]> {
    this.isLoading.set(true);
    setTimeout(() => {
      this.zones.set(this.mockZones);
      this.isLoading.set(false);
    }, 300);
    return of(this.mockZones);
  }

  /**
   * Obtener disponibilidad total (mock)
   */
  loadTotalAvailability(): Observable<{ total: number; occupied: number; available: number }> {
    const total = this.mockZones.reduce((sum, z) => sum + z.totalSpots, 0);
    const occupied = this.mockZones.reduce((sum, z) => sum + z.occupiedSpots, 0);
    return of({ total, occupied, available: total - occupied });
  }

  /**
   * Obtener zona por ID (mock)
   */
  getZoneById(zoneId: string): Observable<ParkingZone> {
    const zone = this.mockZones.find(z => z.id === zoneId);
    return of(zone!);
  }

  /**
   * Suscribirse a cambios en tiempo real (mock - no hace nada)
   */
  subscribeToRealtimeUpdates(): void {
    this.isLoading.set(false);
    this.zones.set(this.mockZones);
  }
}
