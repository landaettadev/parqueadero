import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ref, get, set, update, onValue } from 'firebase/database';
import { ParkingRepository } from '@domain/repositories/parking.repository';
import { ParkingZone } from '@domain/entities/parking-zone.entity';
import { ParkingSpot } from '@domain/entities/parking-spot.entity';
import { getFirebaseDatabase } from '../../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseParkingAdapter extends ParkingRepository {
  private db = getFirebaseDatabase();

  getAllZones(): Observable<ParkingZone[]> {
    const zonesRef = ref(this.db, 'parking_zones');
    
    return new Observable(observer => {
      onValue(zonesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const zones = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            availableSpots: data[key].totalSpots - data[key].occupiedSpots,
            createdAt: new Date(data[key].createdAt)
          }));
          observer.next(zones);
        } else {
          observer.next([]);
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getZoneById(zoneId: string): Observable<ParkingZone> {
    const zoneRef = ref(this.db, `parking_zones/${zoneId}`);
    
    return from(get(zoneRef)).pipe(
      map(snapshot => {
        const data = snapshot.val();
        if (!data) throw new Error('Zone not found');
        return {
          id: zoneId,
          ...data,
          availableSpots: data.totalSpots - data.occupiedSpots,
          createdAt: new Date(data.createdAt)
        };
      })
    );
  }

  getSpotsByZone(zoneId: string): Observable<ParkingSpot[]> {
    const spotsRef = ref(this.db, `parking_spots/${zoneId}`);
    
    return new Observable(observer => {
      onValue(spotsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const spots = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            occupiedAt: data[key].occupiedAt ? new Date(data[key].occupiedAt) : undefined,
            createdAt: new Date(data[key].createdAt)
          }));
          observer.next(spots);
        } else {
          observer.next([]);
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  updateSpotStatus(spotId: string, isOccupied: boolean, userId?: string): Observable<void> {
    const spotRef = ref(this.db, `parking_spots/${spotId}`);
    
    const updates = {
      isOccupied,
      occupiedBy: userId || null,
      occupiedAt: isOccupied ? new Date().toISOString() : null
    };

    return from(update(spotRef, updates)).pipe(
      map(() => undefined)
    );
  }

  getTotalAvailability(): Observable<{ total: number; occupied: number; available: number }> {
    const zonesRef = ref(this.db, 'parking_zones');
    
    return new Observable(observer => {
      onValue(zonesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const zones = Object.values(data) as any[];
          const total = zones.reduce((sum, zone) => sum + zone.totalSpots, 0);
          const occupied = zones.reduce((sum, zone) => sum + zone.occupiedSpots, 0);
          
          observer.next({
            total,
            occupied,
            available: total - occupied
          });
        } else {
          observer.next({ total: 0, occupied: 0, available: 0 });
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }
}
