import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '@application/services/analytics.service';
import { LABELS } from '@shared/constants/labels.constants';

@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  readonly labels = LABELS;
  readonly Math = Math;

  // Signals
  occupancyStats = this.analyticsService.occupancyStats;
  peakHours = this.analyticsService.peakHours;
  isLoading = this.analyticsService.isLoading;
  selectedPeriod = signal<'today' | 'week' | 'month'>('today');

  // Computed
  peakHour = computed(() => {
    const hours = this.peakHours();
    if (hours.length === 0) return null;
    return hours.reduce((max, hour) => 
      hour.averageOccupancy > max.averageOccupancy ? hour : max
    );
  });

  valleyHour = computed(() => {
    const hours = this.peakHours();
    if (hours.length === 0) return null;
    return hours.reduce((min, hour) => 
      hour.averageOccupancy < min.averageOccupancy ? hour : min
    );
  });

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.analyticsService.generateMockData();
  }

  setPeriod(period: 'today' | 'week' | 'month'): void {
    this.selectedPeriod.set(period);
    // En producción, recargar datos según el período
  }

  getBarHeight(occupancy: number): number {
    return (occupancy / 150) * 100; // 150 es el total de espacios
  }

  getBarColor(occupancy: number): string {
    const percentage = (occupancy / 150) * 100;
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  exportReport(): void {
    // TODO: Implementar exportación de reportes
    console.log('Exportando reporte...');
  }
}
