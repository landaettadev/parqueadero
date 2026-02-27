import { Observable } from 'rxjs';
import { ParkingZone } from '../entities/parking-zone.entity';
import { ParkingSpot } from '../entities/parking-spot.entity';

/**
 * Repository interface for Parking operations
 * Following Dependency Inversion Principle
 */
export abstract class ParkingRepository {
  abstract getAllZones(): Observable<ParkingZone[]>;
  abstract getZoneById(zoneId: string): Observable<ParkingZone>;
  abstract getSpotsByZone(zoneId: string): Observable<ParkingSpot[]>;
  abstract updateSpotStatus(spotId: string, isOccupied: boolean, userId?: string): Observable<void>;
  abstract getTotalAvailability(): Observable<{ total: number; occupied: number; available: number }>;
}
