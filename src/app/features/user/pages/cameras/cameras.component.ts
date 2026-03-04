import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LiveCamera {
  id: string;
  name: string;
  location: string;
  entrance: number;
  vehicleType: 'car' | 'motorcycle' | 'both';
  status: 'live' | 'offline';
  imageUrl: string;
  detections: number;
}

interface LprEvent {
  id: string;
  plate: string;
  vehicleType: 'car' | 'motorcycle';
  action: 'entry' | 'exit';
  camera: string;
  zone: string;
  cell: string;
  timestamp: Date;
  confidence: number;
}

interface VehicleLocation {
  plate: string;
  zone: string;
  cell: string;
  entrance: number;
  entryTime: Date;
  vehicleType: 'car' | 'motorcycle';
  found: boolean;
}

@Component({
  standalone: true,
  selector: 'app-user-cameras',
  imports: [CommonModule, FormsModule],
  templateUrl: './cameras.component.html'
})
export class UserCamerasComponent {
  private router = inject(Router);

  // === TABS ===
  activeTab = signal<'cameras' | 'lpr' | 'locate'>('cameras');

  // === CAMARAS EN VIVO ===
  cameras = signal<LiveCamera[]>([
    { id: 'c1', name: 'Entrada 1 — Carros', location: 'Ing. Bloque 18', entrance: 1, vehicleType: 'car',
      status: 'live', detections: 12,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+1+Carros+•+EN+VIVO' },
    { id: 'c2', name: 'Entrada 2 — Carros', location: 'Biblioteca Bloque 20', entrance: 2, vehicleType: 'car',
      status: 'live', detections: 7,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+2+Carros+•+EN+VIVO' },
    { id: 'c3', name: 'Entrada 3 — Carros', location: 'Bloque Ciencias 32', entrance: 3, vehicleType: 'car',
      status: 'live', detections: 21,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+3+Carros+•+EN+VIVO' },
    { id: 'c4', name: 'Entrada 4 — Carros', location: 'Deportivo Sur Bloque 44', entrance: 4, vehicleType: 'car',
      status: 'offline', detections: 0,
      imageUrl: 'https://placehold.co/640x360/1a1a1a/ef4444/png?text=⚠+Camara+4+Sin+Señal' },
    { id: 'c5', name: 'Entrada 5 — Carros', location: 'Visitantes Av. El Poblado', entrance: 5, vehicleType: 'car',
      status: 'live', detections: 4,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+5+Carros+•+EN+VIVO' },
    { id: 'c6', name: 'Entrada 6 — Carros', location: 'Posgrados Bloque 38', entrance: 6, vehicleType: 'car',
      status: 'live', detections: 9,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+6+Carros+•+EN+VIVO' },
    { id: 'm1', name: 'Entrada 1 — Motos', location: 'Costado Ingenierías', entrance: 1, vehicleType: 'motorcycle',
      status: 'live', detections: 18,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+1+Motos+•+EN+VIVO' },
    { id: 'm2', name: 'Entrada 2 — Motos', location: 'Costado Biblioteca', entrance: 2, vehicleType: 'motorcycle',
      status: 'live', detections: 33,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+2+Motos+•+EN+VIVO' },
    { id: 'm3', name: 'Entrada 3 — Motos', location: 'Deportivo Sur', entrance: 3, vehicleType: 'motorcycle',
      status: 'live', detections: 6,
      imageUrl: 'https://placehold.co/640x360/0a0a2e/4ade80/png?text=📷+Entrada+3+Motos+•+EN+VIVO' },
  ]);

  selectedCamera = signal<LiveCamera | null>(null);
  cameraFilter = signal<'all' | 'car' | 'motorcycle'>('all');

  filteredCameras = computed(() => {
    const f = this.cameraFilter();
    return f === 'all' ? this.cameras() : this.cameras().filter(c => c.vehicleType === f);
  });

  liveCamerasCount = computed(() => this.cameras().filter(c => c.status === 'live').length);

  // === LPR — DETECCION DE PLACAS ===
  lprEvents = signal<LprEvent[]>([
    { id: 'e1', plate: 'EAF-123', vehicleType: 'car', action: 'entry', camera: 'Entrada 1', zone: 'Parqueadero 1', cell: 'A-14', timestamp: new Date(Date.now() - 2 * 60000), confidence: 98 },
    { id: 'e2', plate: 'MOT-456', vehicleType: 'motorcycle', action: 'entry', camera: 'Entrada 1 Motos', zone: 'Parqueadero 1 Motos', cell: 'M-07', timestamp: new Date(Date.now() - 4 * 60000), confidence: 95 },
    { id: 'e3', plate: 'EAF-789', vehicleType: 'car', action: 'exit', camera: 'Entrada 2', zone: 'Parqueadero 2', cell: '—', timestamp: new Date(Date.now() - 7 * 60000), confidence: 99 },
    { id: 'e4', plate: 'UNI-321', vehicleType: 'car', action: 'entry', camera: 'Entrada 3', zone: 'Parqueadero 3', cell: 'C-02', timestamp: new Date(Date.now() - 11 * 60000), confidence: 97 },
    { id: 'e5', plate: 'MOT-654', vehicleType: 'motorcycle', action: 'exit', camera: 'Entrada 2 Motos', zone: 'Parqueadero 2 Motos', cell: '—', timestamp: new Date(Date.now() - 15 * 60000), confidence: 91 },
    { id: 'e6', plate: 'EAF-555', vehicleType: 'car', action: 'entry', camera: 'Entrada 5', zone: 'Parqueadero 5', cell: 'E-08', timestamp: new Date(Date.now() - 22 * 60000), confidence: 96 },
    { id: 'e7', plate: 'PRF-001', vehicleType: 'car', action: 'entry', camera: 'Entrada 6', zone: 'Parqueadero 6', cell: 'F-22', timestamp: new Date(Date.now() - 35 * 60000), confidence: 99 },
    { id: 'e8', plate: 'MOT-888', vehicleType: 'motorcycle', action: 'entry', camera: 'Entrada 3 Motos', zone: 'Parqueadero 3 Motos', cell: 'M-15', timestamp: new Date(Date.now() - 48 * 60000), confidence: 93 },
  ]);

  lprFilter = signal<'all' | 'entry' | 'exit'>('all');

  filteredLpr = computed(() => {
    const f = this.lprFilter();
    return f === 'all' ? this.lprEvents() : this.lprEvents().filter(e => e.action === f);
  });

  // === LOCALIZADOR DE VEHICULO ===
  searchPlate = signal('');
  searchResult = signal<VehicleLocation | null>(null);
  searchLoading = signal(false);
  searchDone = signal(false);

  // Mock database of vehicles currently parked
  private parkedVehicles: VehicleLocation[] = [
    { plate: 'EAF-123', zone: 'Parqueadero 1 — Carros', cell: 'A-14', entrance: 1, vehicleType: 'car', entryTime: new Date(Date.now() - 42 * 60000), found: true },
    { plate: 'MOT-456', zone: 'Parqueadero 1 — Motos', cell: 'M-07', entrance: 1, vehicleType: 'motorcycle', entryTime: new Date(Date.now() - 34 * 60000), found: true },
    { plate: 'UNI-321', zone: 'Parqueadero 3 — Carros', cell: 'C-02', entrance: 3, vehicleType: 'car', entryTime: new Date(Date.now() - 19 * 60000), found: true },
    { plate: 'EAF-555', zone: 'Parqueadero 5 — Carros', cell: 'E-08', entrance: 5, vehicleType: 'car', entryTime: new Date(Date.now() - 12 * 60000), found: true },
    { plate: 'PRF-001', zone: 'Parqueadero 6 — Carros', cell: 'F-22', entrance: 6, vehicleType: 'car', entryTime: new Date(Date.now() - 55 * 60000), found: true },
    { plate: 'MOT-888', zone: 'Parqueadero 3 — Motos', cell: 'M-15', entrance: 3, vehicleType: 'motorcycle', entryTime: new Date(Date.now() - 28 * 60000), found: true },
  ];

  searchVehicle(): void {
    const plate = this.searchPlate().trim().toUpperCase();
    if (!plate) return;
    this.searchLoading.set(true);
    this.searchDone.set(false);
    this.searchResult.set(null);

    setTimeout(() => {
      const found = this.parkedVehicles.find(
        v => v.plate.replace('-', '').toUpperCase() === plate.replace('-', '').toUpperCase()
      );
      this.searchResult.set(found || { plate, zone: '', cell: '', entrance: 0, vehicleType: 'car', entryTime: new Date(), found: false });
      this.searchLoading.set(false);
      this.searchDone.set(true);
    }, 1200);
  }

  clearSearch(): void {
    this.searchPlate.set('');
    this.searchResult.set(null);
    this.searchDone.set(false);
  }

  // Helpers
  getTimeAgo(date: Date): string {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    return `Hace ${Math.floor(mins / 60)}h ${mins % 60}min`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  getParkedDuration(date: Date): string {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}min`;
  }
}
