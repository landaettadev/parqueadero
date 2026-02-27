export interface ParkingZone {
  id: string;
  name: string;
  description?: string;
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  status?: 'available' | 'limited' | 'full';
  latitude?: number;
  longitude?: number;
  location?: { lat: number; lng: number };
  createdAt?: Date;
}
