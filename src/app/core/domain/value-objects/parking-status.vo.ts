/**
 * Value Object for parking status
 */
export type ParkingStatusType = 'available' | 'limited' | 'full';

export class ParkingStatus {
  constructor(
    public readonly available: number,
    public readonly total: number
  ) {
    if (available < 0 || total < 0) {
      throw new Error('Available and total must be non-negative');
    }
    if (available > total) {
      throw new Error('Available cannot exceed total');
    }
  }

  get status(): ParkingStatusType {
    const percentage = (this.available / this.total) * 100;
    if (percentage > 50) return 'available';
    if (percentage > 20) return 'limited';
    return 'full';
  }

  get occupancyPercentage(): number {
    return ((this.total - this.available) / this.total) * 100;
  }

  get isAvailable(): boolean {
    return this.available > 0;
  }
}
