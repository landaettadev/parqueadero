import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-metric-card',
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>('');
  icon = input<string>('chart');
  color = input<'blue' | 'green' | 'yellow' | 'red' | 'purple'>('blue');
}
