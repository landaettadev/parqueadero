import { Observable } from 'rxjs';

export interface OccupancyStats {
  timestamp: Date;
  totalOccupied: number;
  totalAvailable: number;
  zoneStats: { zoneId: string; zoneName: string; occupied: number; total: number }[];
}

export interface PeakHoursData {
  hour: number;
  averageOccupancy: number;
}

/**
 * Repository interface for Analytics operations
 */
export abstract class AnalyticsRepository {
  abstract getOccupancyStats(startDate: Date, endDate: Date): Observable<OccupancyStats[]>;
  abstract getPeakHours(): Observable<PeakHoursData[]>;
  abstract getHistoricalData(days: number): Observable<any[]>;
}
