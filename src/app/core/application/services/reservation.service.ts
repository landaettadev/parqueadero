import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '@domain/entities/reservation.entity';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private mockReservations: Reservation[] = [
    {
      id: 'res-1', userId: 'user-demo', vehicleId: 'v1', zoneId: 'zone-a', spotId: 'A-12',
      scheduledTime: new Date(Date.now() + 30 * 60 * 1000),
      expiresAt: new Date(Date.now() + 45 * 60 * 1000),
      status: 'CONFIRMED', createdAt: new Date()
    }
  ];

  reservations = signal<Reservation[]>(this.mockReservations);
  isLoading = signal(false);

  activeReservation = computed(() =>
    this.reservations().find(r => r.status === 'CONFIRMED' || r.status === 'ACTIVE') || null
  );

  hasActiveReservation = computed(() => this.activeReservation() !== null);

  loadReservations(): Observable<Reservation[]> {
    this.isLoading.set(true);
    setTimeout(() => { this.reservations.set(this.mockReservations); this.isLoading.set(false); }, 300);
    return of(this.mockReservations);
  }

  createReservation(zoneId: string, vehicleId: string, minutesFromNow: number): Observable<Reservation> {
    const now = new Date();
    const scheduled = new Date(now.getTime() + minutesFromNow * 60 * 1000);
    const expires = new Date(scheduled.getTime() + 15 * 60 * 1000);

    const reservation: Reservation = {
      id: `res-${Date.now()}`, userId: 'user-demo', vehicleId, zoneId,
      spotId: `${zoneId.split('-')[1]?.toUpperCase() || 'A'}-${Math.floor(Math.random() * 50) + 1}`,
      scheduledTime: scheduled, expiresAt: expires,
      status: 'CONFIRMED', createdAt: now
    };

    this.mockReservations.push(reservation);
    this.reservations.set([...this.mockReservations]);
    return of(reservation);
  }

  cancelReservation(id: string): Observable<void> {
    this.mockReservations = this.mockReservations.map(r =>
      r.id === id ? { ...r, status: 'CANCELLED' as const } : r
    );
    this.reservations.set([...this.mockReservations]);
    return of(void 0);
  }

  getTimeUntilExpiry(reservation: Reservation): number {
    return Math.max(0, Math.floor((reservation.expiresAt.getTime() - Date.now()) / 60000));
  }
}
