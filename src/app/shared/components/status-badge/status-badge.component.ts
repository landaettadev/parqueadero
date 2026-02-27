import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeStatus = 'available' | 'limited' | 'full' | 'waiting' | 'active';

@Component({
  standalone: true,
  selector: 'app-status-badge',
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  status = input.required<BadgeStatus>();
  size = input<'sm' | 'md' | 'lg'>('md');

  statusConfig = computed(() => {
    const status = this.status();
    const configs = {
      available: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '✓',
        text: 'Disponible'
      },
      limited: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⚠',
        text: 'Limitado'
      },
      full: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '✕',
        text: 'Lleno'
      },
      waiting: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '⏱',
        text: 'En Cola'
      },
      active: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: '🚗',
        text: 'Parqueado'
      }
    };
    return configs[status] || configs.available;
  });

  sizeClasses = computed(() => {
    const size = this.size();
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };
    return sizes[size];
  });
}
