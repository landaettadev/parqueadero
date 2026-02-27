import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ParkingZone } from '@domain/entities/parking-zone.entity';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  // Datos mock hardcodeados
  private mockZones: ParkingZone[] = [
    {
      id: 'zone-a',
      name: 'Zona A',
      description: 'Parqueadero Principal - Edificio de Ingenierías',
      totalSpots: 50,
      occupiedSpots: 35,
      availableSpots: 15,
      status: 'available',
      location: { lat: 6.2006, lng: -75.5783 }
    },
    {
      id: 'zone-b',
      name: 'Zona B',
      description: 'Parqueadero Secundario - Biblioteca',
      totalSpots: 30,
      occupiedSpots: 28,
      availableSpots: 2,
      status: 'limited',
      location: { lat: 6.2010, lng: -75.5790 }
    },
    {
      id: 'zone-c',
      name: 'Zona C',
      description: 'Parqueadero Visitantes - Entrada Principal',
      totalSpots: 20,
      occupiedSpots: 20,
      availableSpots: 0,
      status: 'full',
      location: { lat: 6.1998, lng: -75.5775 }
    }
  ];

  // Signals para estado reactivo
  zones = signal<ParkingZone[]>(this.mockZones);
  totalAvailability = signal<{ total: number; occupied: number; available: number }>({
    total: 100,
    occupied: 83,
    available: 17
  });
  isLoading = signal(false);

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
