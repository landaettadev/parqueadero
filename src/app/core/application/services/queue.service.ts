import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { QueueEntry } from '@domain/entities/queue-entry.entity';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  // Datos mock
  private mockQueue: QueueEntry[] = [
    { id: '1', userId: 'user-1', position: 1, joinedAt: new Date(), estimatedWaitMinutes: 5, status: 'WAITING' },
    { id: '2', userId: 'user-2', position: 2, joinedAt: new Date(), estimatedWaitMinutes: 10, status: 'WAITING' },
    { id: '3', userId: 'user-3', position: 3, joinedAt: new Date(), estimatedWaitMinutes: 15, status: 'WAITING' },
  ];

  // Signals
  queue = signal<QueueEntry[]>(this.mockQueue);
  userPosition = signal<QueueEntry | null>(null);
  isLoading = signal(false);

  // Computed
  queueSize = computed(() => this.queue().length);
  isInQueue = computed(() => this.userPosition() !== null);
  estimatedWaitTime = computed(() => {
    const position = this.userPosition();
    return position ? position.estimatedWaitMinutes : 0;
  });

  /**
   * Obtener toda la cola (mock)
   */
  loadQueue(): Observable<QueueEntry[]> {
    this.isLoading.set(true);
    setTimeout(() => {
      this.queue.set(this.mockQueue);
      this.isLoading.set(false);
    }, 300);
    return of(this.mockQueue);
  }

  /**
   * Obtener posición del usuario en la cola (mock)
   */
  loadUserPosition(userId: string): Observable<QueueEntry | null> {
    return of(this.userPosition());
  }

  /**
   * Unirse a la cola (mock)
   */
  joinQueue(userId: string): Observable<QueueEntry> {
    this.isLoading.set(true);
    const newEntry: QueueEntry = {
      id: userId,
      userId: userId,
      position: this.mockQueue.length + 1,
      joinedAt: new Date(),
      estimatedWaitMinutes: (this.mockQueue.length + 1) * 5,
      status: 'WAITING'
    };
    this.mockQueue.push(newEntry);
    this.userPosition.set(newEntry);
    this.queue.set([...this.mockQueue]);
    this.isLoading.set(false);
    return of(newEntry);
  }

  /**
   * Salir de la cola (mock)
   */
  leaveQueue(userId: string): Observable<void> {
    this.isLoading.set(true);
    this.mockQueue = this.mockQueue.filter(e => e.id !== userId);
    this.userPosition.set(null);
    this.queue.set([...this.mockQueue]);
    this.isLoading.set(false);
    return of(void 0);
  }

  /**
   * Suscribirse a actualizaciones en tiempo real (mock)
   */
  subscribeToRealtimeUpdates(userId: string): void {
    this.isLoading.set(false);
  }
}
