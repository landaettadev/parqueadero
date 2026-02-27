import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LABELS } from '@shared/constants/labels.constants';

interface PredictionData {
  hour: string;
  availability: number;
}

@Component({
  standalone: true,
  selector: 'app-prediction',
  imports: [CommonModule],
  templateUrl: './prediction.component.html',
  styleUrl: './prediction.component.scss'
})
export class PredictionComponent implements OnInit {
  readonly labels = LABELS;
  readonly Math = Math;

  // Signals
  predictions = signal<PredictionData[]>([]);
  isLoading = signal(false);
  confidence = signal(87);

  // Computed
  bestTime = computed(() => {
    const preds = this.predictions();
    if (preds.length === 0) return null;
    
    const best = preds.reduce((max, pred) => 
      pred.availability > max.availability ? pred : max
    );
    return best;
  });

  ngOnInit(): void {
    this.loadPredictions();
  }

  loadPredictions(): void {
    this.isLoading.set(true);
    
    // Simular datos de predicción basados en la hora actual
    setTimeout(() => {
      const currentHour = new Date().getHours();
      const predictions: PredictionData[] = [];
      
      // Generar predicciones para las próximas 8 horas
      for (let i = 0; i < 8; i++) {
        const hour = (currentHour + i) % 24;
        const availability = this.calculateAvailability(hour);
        
        predictions.push({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          availability
        });
      }
      
      this.predictions.set(predictions);
      this.isLoading.set(false);
    }, 500);
  }

  private calculateAvailability(hour: number): number {
    // Patrón típico universitario
    // Picos: 8-10 AM (baja disponibilidad), 2-4 PM (alta disponibilidad)
    if (hour >= 8 && hour <= 10) return 20 + Math.random() * 15; // 20-35%
    if (hour >= 11 && hour <= 13) return 30 + Math.random() * 20; // 30-50%
    if (hour >= 14 && hour <= 16) return 60 + Math.random() * 20; // 60-80%
    if (hour >= 17 && hour <= 19) return 25 + Math.random() * 15; // 25-40%
    if (hour >= 20 || hour <= 6) return 80 + Math.random() * 15; // 80-95%
    return 50 + Math.random() * 20; // 50-70%
  }

  getBarColor(availability: number): string {
    if (availability > 60) return 'bg-green-500';
    if (availability > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getRecommendation(): string {
    const best = this.bestTime();
    if (!best) return 'Cargando recomendación...';
    
    if (best.availability > 70) {
      return `Excelente momento para llegar. Alta disponibilidad esperada (${Math.round(best.availability)}%).`;
    } else if (best.availability > 50) {
      return `Buen momento para llegar. Disponibilidad moderada esperada (${Math.round(best.availability)}%).`;
    } else {
      return `Considera llegar en otro horario. Disponibilidad limitada esperada (${Math.round(best.availability)}%).`;
    }
  }
}
