import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LABELS } from '@shared/constants/labels.constants';

interface Recommendation {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  standalone: true,
  selector: 'app-ai-insights',
  imports: [CommonModule],
  templateUrl: './ai-insights.component.html',
  styleUrl: './ai-insights.component.scss'
})
export class AiInsightsComponent implements OnInit {
  readonly labels = LABELS;
  readonly Math = Math;

  // Signals
  predictions = signal<Array<{ hour: string; availability: number }>>([]);
  recommendations = signal<Recommendation[]>([]);
  isLoading = signal(false);
  modelConfidence = signal(87);
  averageStayTime = signal(3.5);

  // Computed
  nextPeakHour = computed(() => {
    const preds = this.predictions();
    if (preds.length === 0) return null;
    
    const peaks = preds.filter(p => p.availability < 30);
    return peaks.length > 0 ? peaks[0] : null;
  });

  bestTimeToArrive = computed(() => {
    const preds = this.predictions();
    if (preds.length === 0) return null;
    
    return preds.reduce((max, pred) => 
      pred.availability > max.availability ? pred : max
    );
  });

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights(): void {
    this.isLoading.set(true);

    setTimeout(() => {
      // Generate predictions for next 6 hours
      const currentHour = new Date().getHours();
      const predictions = [];
      
      for (let i = 0; i < 6; i++) {
        const hour = (currentHour + i) % 24;
        predictions.push({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          availability: this.calculateAvailability(hour)
        });
      }
      
      this.predictions.set(predictions);

      // Generate recommendations
      this.recommendations.set([
        {
          id: 'rec-1',
          type: 'warning',
          title: 'Pico inusual detectado',
          description: 'Se espera alta ocupación los martes a las 11 AM. Considerar comunicar a usuarios.',
          priority: 'high'
        },
        {
          id: 'rec-2',
          type: 'info',
          title: 'Optimización de Zona C',
          description: 'La Zona C tiene baja utilización los viernes. Considerar promocionarla.',
          priority: 'medium'
        },
        {
          id: 'rec-3',
          type: 'success',
          title: 'Patrón estable',
          description: 'El sistema de cola está funcionando eficientemente.',
          priority: 'low'
        },
        {
          id: 'rec-4',
          type: 'info',
          title: 'Tendencia de permanencia',
          description: 'El tiempo promedio de estancia ha aumentado 15% este mes.',
          priority: 'medium'
        }
      ]);

      this.isLoading.set(false);
    }, 500);
  }

  private calculateAvailability(hour: number): number {
    // University pattern
    if (hour >= 8 && hour <= 10) return 20 + Math.random() * 15;
    if (hour >= 11 && hour <= 13) return 30 + Math.random() * 20;
    if (hour >= 14 && hour <= 16) return 60 + Math.random() * 20;
    if (hour >= 17 && hour <= 19) return 25 + Math.random() * 15;
    if (hour >= 20 || hour <= 6) return 80 + Math.random() * 15;
    return 50 + Math.random() * 20;
  }

  getRecommendationIcon(type: string): string {
    switch (type) {
      case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return '';
    }
  }

  getRecommendationColor(type: string): string {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'success': return 'bg-green-50 border-green-500 text-green-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  }

  getPriorityBadge(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getBarColor(availability: number): string {
    if (availability > 60) return 'bg-green-500';
    if (availability > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
