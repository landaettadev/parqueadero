import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueRepository } from '@domain/repositories/queue.repository';
import { QueueEntry } from '@domain/entities/queue-entry.entity';

@Injectable({
  providedIn: 'root'
})
export class JoinQueueUseCase {
  private queueRepo = inject(QueueRepository);

  execute(userId: string): Observable<QueueEntry> {
    return this.queueRepo.joinQueue(userId);
  }
}
