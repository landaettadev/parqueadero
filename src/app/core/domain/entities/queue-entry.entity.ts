export interface QueueEntry {
  id: string;
  userId: string;
  position: number;
  joinedAt: Date;
  estimatedWaitMinutes: number;
  status: 'WAITING' | 'NOTIFIED' | 'CANCELLED' | 'COMPLETED';
}
