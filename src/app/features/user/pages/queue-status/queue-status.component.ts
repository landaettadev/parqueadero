import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '@application/services/queue.service';
import { LABELS } from '@shared/constants/labels.constants';

@Component({
  standalone: true,
  selector: 'app-queue-status',
  imports: [CommonModule],
  templateUrl: './queue-status.component.html',
  styleUrl: './queue-status.component.scss'
})
export class QueueStatusComponent implements OnInit {
  private queueService = inject(QueueService);

  readonly labels = LABELS;
  readonly Math = Math;
  
  // Mock user ID - en producción vendría del AuthService
  private readonly mockUserId = 'user-demo-123';

  // Signals del servicio
  queue = this.queueService.queue;
  userPosition = this.queueService.userPosition;
  isLoading = this.queueService.isLoading;
  isInQueue = this.queueService.isInQueue;
  estimatedWaitTime = this.queueService.estimatedWaitTime;
  queueSize = this.queueService.queueSize;

  // Local signals
  showConfirmLeave = signal(false);

  ngOnInit(): void {
    this.queueService.subscribeToRealtimeUpdates(this.mockUserId);
  }

  joinQueue(): void {
    this.queueService.joinQueue(this.mockUserId).subscribe({
      next: () => {
        console.log('Joined queue successfully');
      },
      error: (error) => {
        console.error('Error joining queue:', error);
      }
    });
  }

  confirmLeaveQueue(): void {
    this.showConfirmLeave.set(true);
  }

  cancelLeave(): void {
    this.showConfirmLeave.set(false);
  }

  leaveQueue(): void {
    this.queueService.leaveQueue(this.mockUserId).subscribe({
      next: () => {
        this.showConfirmLeave.set(false);
        console.log('Left queue successfully');
      },
      error: (error) => {
        console.error('Error leaving queue:', error);
      }
    });
  }

  getProgressPercentage(): number {
    const position = this.userPosition();
    if (!position) return 0;
    const total = this.queueSize();
    return total > 0 ? ((total - position.position + 1) / total) * 100 : 0;
  }
}
