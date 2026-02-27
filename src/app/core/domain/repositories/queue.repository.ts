import { Observable } from 'rxjs';
import { QueueEntry } from '../entities/queue-entry.entity';

/**
 * Repository interface for Queue operations
 */
export abstract class QueueRepository {
  abstract getQueue(): Observable<QueueEntry[]>;
  abstract getUserPosition(userId: string): Observable<QueueEntry | null>;
  abstract joinQueue(userId: string): Observable<QueueEntry>;
  abstract leaveQueue(userId: string): Observable<void>;
  abstract notifyNextInQueue(): Observable<void>;
}
