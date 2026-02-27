import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LABELS } from '@shared/constants/labels.constants';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastDetection: Date | null;
  imageUrl: string;
}

interface LogEntry {
  id: string;
  type: 'entry' | 'exit' | 'detection';
  camera: string;
  timestamp: Date;
  details: string;
}

@Component({
  standalone: true,
  selector: 'app-cameras',
  imports: [CommonModule],
  templateUrl: './cameras.component.html',
  styleUrl: './cameras.component.scss'
})
export class CamerasComponent {
  readonly labels = LABELS;

  // Signals
  cameras = signal<Camera[]>([
    {
      id: 'cam-1',
      name: 'Entrada Zona A',
      location: 'Zona A - Principal',
      status: 'active',
      lastDetection: new Date(Date.now() - 2 * 60 * 1000),
      imageUrl: 'https://placehold.co/400x300/000066/FFFFFF/png?text=Entrada+A'
    },
    {
      id: 'cam-2',
      name: 'Salida Zona A',
      location: 'Zona A - Salida',
      status: 'active',
      lastDetection: new Date(Date.now() - 5 * 60 * 1000),
      imageUrl: 'https://placehold.co/400x300/000066/FFFFFF/png?text=Salida+A'
    },
    {
      id: 'cam-3',
      name: 'Entrada Zona B',
      location: 'Zona B - Principal',
      status: 'active',
      lastDetection: new Date(Date.now() - 1 * 60 * 1000),
      imageUrl: 'https://placehold.co/400x300/000066/FFFFFF/png?text=Entrada+B'
    },
    {
      id: 'cam-4',
      name: 'Salida Zona B',
      location: 'Zona B - Salida',
      status: 'inactive',
      lastDetection: null,
      imageUrl: 'https://placehold.co/400x300/666666/FFFFFF/png?text=Sin+Se%C3%B1al'
    }
  ]);

  logs = signal<LogEntry[]>([
    {
      id: 'log-1',
      type: 'entry',
      camera: 'Entrada Zona B',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      details: 'Vehículo ABC-123 detectado'
    },
    {
      id: 'log-2',
      type: 'detection',
      camera: 'Entrada Zona A',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      details: 'Movimiento detectado'
    },
    {
      id: 'log-3',
      type: 'exit',
      camera: 'Salida Zona A',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      details: 'Vehículo XYZ-789 salió'
    },
    {
      id: 'log-4',
      type: 'entry',
      camera: 'Entrada Zona A',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      details: 'Vehículo DEF-456 detectado'
    }
  ]);

  selectedCamera = signal<Camera | null>(null);
  showManualEntry = signal(false);

  // Computed
  activeCameras = computed(() => 
    this.cameras().filter(cam => cam.status === 'active').length
  );

  inactiveCameras = computed(() => 
    this.cameras().filter(cam => cam.status === 'inactive').length
  );

  selectCamera(camera: Camera): void {
    this.selectedCamera.set(camera);
  }

  closeDetails(): void {
    this.selectedCamera.set(null);
  }

  openManualEntry(): void {
    this.showManualEntry.set(true);
  }

  closeManualEntry(): void {
    this.showManualEntry.set(false);
  }

  registerManualEntry(type: 'entry' | 'exit'): void {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      type,
      camera: 'Manual',
      timestamp: new Date(),
      details: `Registro manual de ${type === 'entry' ? 'entrada' : 'salida'}`
    };

    this.logs.update(logs => [newLog, ...logs]);
    this.closeManualEntry();
  }

  getLogIcon(type: string): string {
    switch (type) {
      case 'entry': return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
      case 'exit': return 'M20 12H4';
      case 'detection': return 'M15 12a3 3 0 11-6 0 3 3 0 016 0z';
      default: return '';
    }
  }

  getLogColor(type: string): string {
    switch (type) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'exit': return 'bg-red-100 text-red-800';
      case 'detection': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Hace menos de 1 min';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h`;
  }
}
