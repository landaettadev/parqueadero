import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AnalyticsRepository, OccupancyStats, PeakHoursData } from '@domain/repositories/analytics.repository';

@Injectable({ providedIn: 'root' })
export class MockAnalyticsAdapter extends AnalyticsRepository {

  getOccupancyStats(startDate: Date, endDate: Date): Observable<OccupancyStats[]> {
    const stats: OccupancyStats[] = [];
    const now = new Date();
    for (let h = 0; h < 24; h++) {
      const ts = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h);
      const occ = this.calcOccupancy(h);
      stats.push({
        timestamp: ts,
        totalOccupied: occ,
        totalAvailable: 100 - occ,
        zoneStats: [
          { zoneId: 'zone-a', zoneName: 'Zona A', occupied: Math.round(occ * 0.5), total: 50 },
          { zoneId: 'zone-b', zoneName: 'Zona B', occupied: Math.round(occ * 0.3), total: 30 },
          { zoneId: 'zone-c', zoneName: 'Zona C', occupied: Math.round(occ * 0.2), total: 20 }
        ]
      });
    }
    return of(stats);
  }

  getPeakHours(): Observable<PeakHoursData[]> {
    const hours: PeakHoursData[] = [];
    for (let h = 0; h < 24; h++) {
      hours.push({ hour: h, averageOccupancy: this.calcOccupancy(h) });
    }
    return of(hours);
  }

  getHistoricalData(days: number): Observable<any[]> {
    return of([]);
  }

  private calcOccupancy(hour: number): number {
    if (hour >= 7 && hour <= 9) return 85 + Math.random() * 10;
    if (hour >= 10 && hour <= 12) return 70 + Math.random() * 15;
    if (hour >= 13 && hour <= 15) return 55 + Math.random() * 15;
    if (hour >= 16 && hour <= 18) return 75 + Math.random() * 15;
    if (hour >= 19 || hour <= 6) return 10 + Math.random() * 15;
    return 50 + Math.random() * 20;
  }
}
