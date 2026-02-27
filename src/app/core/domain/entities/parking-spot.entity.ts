export interface ParkingSpot {
  id: string;
  zoneId: string;
  spotNumber: string;
  isOccupied: boolean;
  occupiedBy?: string;
  occupiedAt?: Date;
  createdAt: Date;
}
