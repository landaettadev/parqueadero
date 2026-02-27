import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LABELS } from '@shared/constants/labels.constants';
import { ParkingSession } from '@domain/entities/parking-session.entity';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  readonly labels = LABELS;

  // Signals
  sessions = signal<ParkingSession[]>([]);
  isLoading = signal(false);
  selectedFilter = signal<'all' | 'week' | 'month'>('all');

  // Computed
  filteredSessions = computed(() => {
    const filter = this.selectedFilter();
    const sessions = this.sessions();
    const now = new Date();

    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessions.filter(s => new Date(s.entryTime) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return sessions.filter(s => new Date(s.entryTime) >= monthAgo);
    }
    return sessions;
  });

  averageDuration = computed(() => {
    const sessions = this.filteredSessions().filter(s => s.durationMinutes);
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    return Math.round(total / sessions.length);
  });

  favoriteZone = computed(() => {
    const sessions = this.filteredSessions();
    if (sessions.length === 0) return 'N/A';

    const zoneCounts = sessions.reduce((acc, s) => {
      acc[s.zoneId] = (acc[s.zoneId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favorite = Object.entries(zoneCounts).reduce((max, [zone, count]) =>
      count > max.count ? { zone, count } : max
    , { zone: '', count: 0 });

    return this.getZoneName(favorite.zone);
  });

  totalVisits = computed(() => this.filteredSessions().length);

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);

    // Simular datos de historial
    setTimeout(() => {
      const mockSessions: ParkingSession[] = this.generateMockSessions();
      this.sessions.set(mockSessions);
      this.isLoading.set(false);
    }, 500);
  }

  private generateMockSessions(): ParkingSession[] {
    const sessions: ParkingSession[] = [];
    const zones = ['zone-a', 'zone-b', 'zone-c'];
    const now = new Date();

    // Generar 15 sesiones de los últimos 2 meses
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const entryTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const duration = 60 + Math.floor(Math.random() * 240); // 1-5 horas
      const exitTime = new Date(entryTime.getTime() + duration * 60 * 1000);

      sessions.push({
        id: `session-${i}`,
        userId: 'user-demo-123',
        spotId: `spot-${Math.floor(Math.random() * 50)}`,
        zoneId: zones[Math.floor(Math.random() * zones.length)],
        entryTime,
        exitTime,
        durationMinutes: duration
      });
    }

    return sessions.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
  }

  setFilter(filter: 'all' | 'week' | 'month'): void {
    this.selectedFilter.set(filter);
  }

  getZoneName(zoneId: string): string {
    const zoneMap: Record<string, string> = {
      'zone-a': 'Zona A',
      'zone-b': 'Zona B',
      'zone-c': 'Zona C'
    };
    return zoneMap[zoneId] || zoneId;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
