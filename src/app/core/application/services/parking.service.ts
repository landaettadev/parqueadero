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
      id: 'car-1', name: 'Parqueadero 1 — Carros', entrance: 1,
      description: 'Entrada 1 · Edificio de Ingenierías (Bloque 18)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 80, availableSpots: 20,
      status: 'available', location: { lat: 6.2006, lng: -75.5783 }
    },
    {
      id: 'car-2', name: 'Parqueadero 2 — Carros', entrance: 2,
      description: 'Entrada 2 · Biblioteca (Bloque 20)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 60, availableSpots: 40,
      status: 'available', location: { lat: 6.2010, lng: -75.5790 }
    },
    {
      id: 'car-3', name: 'Parqueadero 3 — Carros', entrance: 3,
      description: 'Entrada 3 · Bloque de Ciencias (Bloque 32)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 95, availableSpots: 5,
      status: 'limited', location: { lat: 6.1998, lng: -75.5775 }
    },
    {
      id: 'car-4', name: 'Parqueadero 4 — Carros', entrance: 4,
      description: 'Entrada 4 · Deportivo Sur (Bloque 44)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 100, availableSpots: 0,
      status: 'full', location: { lat: 6.1995, lng: -75.5770 }
    },
    {
      id: 'car-5', name: 'Parqueadero 5 — Carros', entrance: 5,
      description: 'Entrada 5 · Visitantes Principal (Av. El Poblado)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 72, availableSpots: 28,
      status: 'available', location: { lat: 6.2014, lng: -75.5786 }
    },
    {
      id: 'car-6', name: 'Parqueadero 6 — Carros', entrance: 6,
      description: 'Entrada 6 · Posgrados (Bloque 38)',
      vehicleType: 'car', totalSpots: 100, occupiedSpots: 50, availableSpots: 50,
      status: 'available', location: { lat: 6.2001, lng: -75.5780 }
    },
    // === MOTOS — 3 entradas ===
    {
      id: 'moto-1', name: 'Parqueadero 1 — Motos', entrance: 1,
      description: 'Entrada 1 · Costado Ingenierías',
      vehicleType: 'motorcycle', totalSpots: 80, occupiedSpots: 54, availableSpots: 26,
      status: 'available', location: { lat: 6.2007, lng: -75.5782 }
    },
    {
      id: 'moto-2', name: 'Parqueadero 2 — Motos', entrance: 2,
      description: 'Entrada 2 · Costado Biblioteca',
      vehicleType: 'motorcycle', totalSpots: 80, occupiedSpots: 78, availableSpots: 2,
      status: 'limited', location: { lat: 6.2011, lng: -75.5791 }
    },
    {
      id: 'moto-3', name: 'Parqueadero 3 — Motos', entrance: 3,
      description: 'Entrada 3 · Deportivo Sur',
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
