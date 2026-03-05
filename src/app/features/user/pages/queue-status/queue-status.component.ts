import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService, EntranceQueue } from '@application/services/queue.service';

@Component({
  standalone: true,
  selector: 'app-queue-status',
  imports: [CommonModule],
  templateUrl: './queue-status.component.html',
  styleUrl: './queue-status.component.scss'
})
export class QueueStatusComponent implements OnInit {
  private queueService = inject(QueueService);

  readonly Math = Math;
  private readonly mockUserId = 'user-demo-123';

  // Signals del servicio
  entranceQueues = this.queueService.entranceQueues;
  carQueues = this.queueService.getCarQueues;
  motoQueues = this.queueService.getMotoQueues;
  userQueueStatus = this.queueService.userQueueStatus;
  isInQueue = this.queueService.isInQueue;
  isLoading = this.queueService.isLoading;

  // Local
  showConfirmLeave = signal(false);
  selectedEntrance = signal<EntranceQueue | null>(null);
  vehicleFilter = signal<'all' | 'car' | 'motorcycle'>('all');

  currentEntrance = computed(() => {
    const status = this.userQueueStatus();
    if (!status) return null;
    return this.queueService.getEntranceById(status.entranceId) ?? null;
  });

  progressPercentage = computed(() => {
    const status = this.userQueueStatus();
    const entrance = this.currentEntrance();
    if (!status || !entrance) return 0;
    const total = entrance.queue.length;
    return total > 0 ? ((total - status.position + 1) / total) * 100 : 0;
  });

  filteredQueues = computed(() => {
    const f = this.vehicleFilter();
    return f === 'all'
      ? this.entranceQueues()
      : this.entranceQueues().filter(e => e.vehicleType === f);
  });

  totalCarQueueSize = computed(() => this.carQueues().reduce((s, e) => s + e.queue.length, 0));
  totalMotoQueueSize = computed(() => this.motoQueues().reduce((s, e) => s + e.queue.length, 0));

  ngOnInit(): void {
    this.queueService.subscribeToRealtimeUpdates(this.mockUserId);
  }

  joinQueue(entrance: EntranceQueue): void {
    this.queueService.joinQueue(this.mockUserId, entrance.entranceId).subscribe();
    this.selectedEntrance.set(null);
  }

  leaveQueue(): void {
    this.queueService.leaveQueue(this.mockUserId).subscribe(() => {
      this.showConfirmLeave.set(false);
    });
  }

  getQueueColor(size: number, isOpen: boolean): string {
    if (!isOpen) return '#9ca3af';
    if (size === 0) return '#10b981';
    if (size <= 2) return '#f59e0b';
    return '#ef4444';
  }

  getQueueLabel(size: number, isOpen: boolean): string {
    if (!isOpen) return 'Cerrada';
    if (size === 0) return 'Sin espera';
    return `${size} en espera`;
  }
}
