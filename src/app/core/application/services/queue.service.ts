import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QueueEntry } from '@domain/entities/queue-entry.entity';

export interface EntranceQueue {
  entranceId: string;
  entrance: number;
  vehicleType: 'car' | 'motorcycle';
  name: string;
  location: string;
  queue: QueueEntry[];
  isOpen: boolean;
}

export interface UserQueueStatus {
  entranceId: string;
  position: number;
  estimatedWaitMinutes: number;
  joinedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  // Cola por entrada — 6 carros + 3 motos
  private _entranceQueues: EntranceQueue[] = [
    {
      entranceId: 'car-1', entrance: 1, vehicleType: 'car',
      name: 'Entrada 1 — Las Vegas', location: 'Las Vegas',
      isOpen: true,
      queue: [
        { id: 'c1u1', userId: 'user-a', position: 1, joinedAt: new Date(Date.now() - 8 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
        { id: 'c1u2', userId: 'user-b', position: 2, joinedAt: new Date(Date.now() - 6 * 60000), estimatedWaitMinutes: 10, status: 'WAITING' },
        { id: 'c1u3', userId: 'user-c', position: 3, joinedAt: new Date(Date.now() - 4 * 60000), estimatedWaitMinutes: 15, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'car-2', entrance: 2, vehicleType: 'car',
      name: 'Entrada 2 — Las Vegas (Empleados)', location: 'Las Vegas (Empleados)',
      isOpen: true,
      queue: [
        { id: 'c2u1', userId: 'user-d', position: 1, joinedAt: new Date(Date.now() - 3 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'car-3', entrance: 3, vehicleType: 'car',
      name: 'Entrada 3 — Las Hermosas (Regional)', location: 'Las Hermosas (Regional)',
      isOpen: true,
      queue: [
        { id: 'c3u1', userId: 'user-e', position: 1, joinedAt: new Date(Date.now() - 12 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
        { id: 'c3u2', userId: 'user-f', position: 2, joinedAt: new Date(Date.now() - 9 * 60000), estimatedWaitMinutes: 10, status: 'WAITING' },
        { id: 'c3u3', userId: 'user-g', position: 3, joinedAt: new Date(Date.now() - 6 * 60000), estimatedWaitMinutes: 15, status: 'WAITING' },
        { id: 'c3u4', userId: 'user-h', position: 4, joinedAt: new Date(Date.now() - 3 * 60000), estimatedWaitMinutes: 20, status: 'WAITING' },
        { id: 'c3u5', userId: 'user-i', position: 5, joinedAt: new Date(Date.now() - 1 * 60000), estimatedWaitMinutes: 25, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'car-4', entrance: 4, vehicleType: 'car',
      name: 'Entrada 4 — La Regional', location: 'La Regional',
      isOpen: false,
      queue: []
    },
    {
      entranceId: 'car-5', entrance: 5, vehicleType: 'car',
      name: 'Entrada 5 — La Regional', location: 'La Regional',
      isOpen: true,
      queue: [
        { id: 'c5u1', userId: 'user-j', position: 1, joinedAt: new Date(Date.now() - 5 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
        { id: 'c5u2', userId: 'user-k', position: 2, joinedAt: new Date(Date.now() - 2 * 60000), estimatedWaitMinutes: 10, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'car-6', entrance: 6, vehicleType: 'car',
      name: 'Entrada 6 — Idiomas', location: 'Idiomas',
      isOpen: true,
      queue: []
    },
    {
      entranceId: 'moto-1', entrance: 1, vehicleType: 'motorcycle',
      name: 'Entrada 1 — Las Vegas', location: 'Las Vegas',
      isOpen: true,
      queue: [
        { id: 'm1u1', userId: 'user-l', position: 1, joinedAt: new Date(Date.now() - 4 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
        { id: 'm1u2', userId: 'user-m', position: 2, joinedAt: new Date(Date.now() - 2 * 60000), estimatedWaitMinutes: 10, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'moto-2', entrance: 2, vehicleType: 'motorcycle',
      name: 'Entrada 2 — La Regional', location: 'La Regional',
      isOpen: true,
      queue: [
        { id: 'm2u1', userId: 'user-n', position: 1, joinedAt: new Date(Date.now() - 7 * 60000), estimatedWaitMinutes: 5, status: 'WAITING' },
        { id: 'm2u2', userId: 'user-o', position: 2, joinedAt: new Date(Date.now() - 5 * 60000), estimatedWaitMinutes: 10, status: 'WAITING' },
        { id: 'm2u3', userId: 'user-p', position: 3, joinedAt: new Date(Date.now() - 3 * 60000), estimatedWaitMinutes: 15, status: 'WAITING' },
      ]
    },
    {
      entranceId: 'moto-3', entrance: 3, vehicleType: 'motorcycle',
      name: 'Entrada 3 — Idiomas', location: 'Idiomas',
      isOpen: true,
      queue: []
    },
  ];

  // Signals
  entranceQueues = signal<EntranceQueue[]>(this._entranceQueues);
  userQueueStatus = signal<UserQueueStatus | null>(null);
  isLoading = signal(false);

  // Compat signals (usados por dashboard y otros componentes)
  queue = computed(() => {
    const status = this.userQueueStatus();
    if (!status) return [];
    const entrance = this.entranceQueues().find(e => e.entranceId === status.entranceId);
    return entrance?.queue ?? [];
  });

  userPosition = computed(() => {
    const status = this.userQueueStatus();
    if (!status) return null;
    return {
      id: 'me',
      userId: 'user-demo-123',
      position: status.position,
      joinedAt: status.joinedAt,
      estimatedWaitMinutes: status.estimatedWaitMinutes,
      status: 'WAITING' as const
    };
  });

  isInQueue = computed(() => this.userQueueStatus() !== null);
  queueSize = computed(() => {
    return this._entranceQueues.reduce((sum, e) => sum + e.queue.length, 0);
  });

  estimatedWaitTime = computed(() => this.userQueueStatus()?.estimatedWaitMinutes ?? 0);

  getCarQueues = computed(() => this.entranceQueues().filter(e => e.vehicleType === 'car'));
  getMotoQueues = computed(() => this.entranceQueues().filter(e => e.vehicleType === 'motorcycle'));

  joinQueue(userId: string, entranceId: string): Observable<UserQueueStatus> {
    const queues = [...this._entranceQueues];
    const idx = queues.findIndex(e => e.entranceId === entranceId);
    if (idx === -1) return of(this.userQueueStatus()!);

    const pos = queues[idx].queue.length + 1;
    const entry: QueueEntry = {
      id: userId,
      userId,
      position: pos,
      joinedAt: new Date(),
      estimatedWaitMinutes: pos * 5,
      status: 'WAITING'
    };
    queues[idx] = { ...queues[idx], queue: [...queues[idx].queue, entry] };
    this._entranceQueues = queues;
    this.entranceQueues.set([...queues]);

    const status: UserQueueStatus = {
      entranceId,
      position: pos,
      estimatedWaitMinutes: pos * 5,
      joinedAt: new Date()
    };
    this.userQueueStatus.set(status);
    return of(status);
  }

  leaveQueue(userId: string): Observable<void> {
    const status = this.userQueueStatus();
    if (!status) return of(void 0);

    const queues = [...this._entranceQueues];
    const idx = queues.findIndex(e => e.entranceId === status.entranceId);
    if (idx !== -1) {
      queues[idx] = { ...queues[idx], queue: queues[idx].queue.filter(e => e.userId !== userId) };
      this._entranceQueues = queues;
      this.entranceQueues.set([...queues]);
    }
    this.userQueueStatus.set(null);
    return of(void 0);
  }

  subscribeToRealtimeUpdates(userId: string): void {
    this.isLoading.set(false);
  }

  getEntranceById(id: string): EntranceQueue | undefined {
    return this.entranceQueues().find(e => e.entranceId === id);
  }
}
