export interface ParkingSession {
  id: string;
  userId: string;
  spotId: string;
  zoneId: string;
  entryTime: Date;
  exitTime?: Date;
  durationMinutes?: number;
}
