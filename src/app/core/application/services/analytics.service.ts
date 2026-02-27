import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AnalyticsRepository, OccupancyStats, PeakHoursData } from '@domain/repositories/analytics.repository';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analyticsRepo = inject(AnalyticsRepository);

  // Signals
  occupancyStats = signal<OccupancyStats[]>([]);
  peakHours = signal<PeakHoursData[]>([]);
  isLoading = signal(false);

  // Computed
  currentOccupancy = computed(() => {
    const stats = this.occupancyStats();
    if (stats.length === 0) return null;
    return stats[stats.length - 1];
  });

  averageOccupancy = computed(() => {
    const stats = this.occupancyStats();
    if (stats.length === 0) return 0;
    const total = stats.reduce((sum, stat) => sum + stat.totalOccupied, 0);
    return Math.round(total / stats.length);
  });

  /**
   * Cargar estadísticas de ocupación
   */
  loadOccupancyStats(startDate: Date, endDate: Date): Observable<OccupancyStats[]> {
    this.isLoading.set(true);
    return this.analyticsRepo.getOccupancyStats(startDate, endDate).pipe(
      tap(stats => {
        this.occupancyStats.set(stats);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Cargar horas pico
   */
  loadPeakHours(): Observable<PeakHoursData[]> {
    return this.analyticsRepo.getPeakHours().pipe(
      tap(hours => {
        this.peakHours.set(hours);
      })
    );
  }

  /**
   * Generar datos simulados para demo
   */
  generateMockData(): void {
    // Generar estadísticas del día actual
    const now = new Date();
    const stats: OccupancyStats[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour);
      const occupancy = this.calculateOccupancyForHour(hour);
      
      stats.push({
        timestamp,
        totalOccupied: occupancy,
        totalAvailable: 150 - occupancy,
        zoneStats: [
          { zoneId: 'zone-a', zoneName: 'Zona A', occupied: Math.round(occupancy * 0.33), total: 50 },
          { zoneId: 'zone-b', zoneName: 'Zona B', occupied: Math.round(occupancy * 0.40), total: 60 },
          { zoneId: 'zone-c', zoneName: 'Zona C', occupied: Math.round(occupancy * 0.27), total: 40 }
        ]
      });
    }

    this.occupancyStats.set(stats);

    // Generar horas pico
    const peakHours: PeakHoursData[] = [];
    for (let hour = 0; hour < 24; hour++) {
      peakHours.push({
        hour,
        averageOccupancy: this.calculateOccupancyForHour(hour)
      });
    }
    this.peakHours.set(peakHours);
  }

  private calculateOccupancyForHour(hour: number): number {
    // Patrón universitario
    if (hour >= 7 && hour <= 9) return 120 + Math.random() * 20; // Pico matutino
    if (hour >= 10 && hour <= 12) return 100 + Math.random() * 20;
    if (hour >= 13 && hour <= 15) return 70 + Math.random() * 20; // Valle tarde
    if (hour >= 16 && hour <= 18) return 110 + Math.random() * 20; // Pico salida
    if (hour >= 19 || hour <= 6) return 20 + Math.random() * 20; // Noche
    return 80 + Math.random() * 20;
  }
}
