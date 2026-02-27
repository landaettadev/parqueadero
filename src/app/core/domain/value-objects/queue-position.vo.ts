/**
 * Value Object for queue position
 */
export class QueuePosition {
  constructor(
    public readonly position: number,
    public readonly totalInQueue: number
  ) {
    if (position < 1) {
      throw new Error('Position must be at least 1');
    }
    if (position > totalInQueue) {
      throw new Error('Position cannot exceed total in queue');
    }
  }

  get estimatedWaitMinutes(): number {
    // Estimate 5 minutes per person ahead
    return (this.position - 1) * 5;
  }

  get isNext(): boolean {
    return this.position === 1;
  }

  toString(): string {
    return `${this.position} de ${this.totalInQueue}`;
  }
}
