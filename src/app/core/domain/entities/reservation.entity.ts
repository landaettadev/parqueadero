export interface Reservation {
  id: string;
  userId: string;
  vehicleId: string;
  zoneId: string;
  spotId?: string;
  scheduledTime: Date;
  expiresAt: Date;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  createdAt: Date;
}
