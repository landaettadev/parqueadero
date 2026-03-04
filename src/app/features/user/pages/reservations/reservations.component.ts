import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '@application/services/reservation.service';
import { ParkingService } from '@application/services/parking.service';
import { VehicleService } from '@application/services/vehicle.service';
import { Reservation } from '@domain/entities/reservation.entity';

type FormMode = 'create' | 'edit';
type FilterStatus = 'all' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private parkingService = inject(ParkingService);
  private vehicleService = inject(VehicleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Data signals
  reservations = this.reservationService.reservations;
  activeReservation = this.reservationService.activeReservation;
  zones = this.parkingService.zones;
  vehicles = this.vehicleService.vehicles;

  // UI state
  showForm = signal(false);
  formMode = signal<FormMode>('create');
  editingId = signal<string | null>(null);
  filterStatus = signal<FilterStatus>('all');
  confirmCancelId = signal<string | null>(null);
  showSuccess = signal(false);
  successMsg = signal('');

  // Form fields
  form = signal({
    zoneId: 'zone-a',
    vehicleId: '',
    date: this.getTodayDate(),
    time: this.getNextHalfHour(),
    duration: 60,        // minutes
    notes: '',
    spotPreference: 'any' as 'any' | 'covered' | 'accessible'
  });

  // Computed
  filteredReservations = computed(() => {
    const f = this.filterStatus();
    return f === 'all'
      ? this.reservations()
      : this.reservations().filter(r => r.status === f);
  });

  selectedZoneInfo = computed(() =>
    this.zones().find(z => z.id === this.form().zoneId) || null
  );

  ngOnInit(): void {
    // Pre-select vehicle default
    const v = this.vehicleService.defaultVehicle();
    if (v) this.updateForm('vehicleId', v.id);

    // Query param desde el mapa
    this.route.queryParams.subscribe(params => {
      if (params['zone']) {
        this.updateForm('zoneId', params['zone']);
        this.openCreateForm();
      }
    });
  }

  // Form helpers
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getNextHalfHour(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() < 30 ? 30 : 60, 0, 0);
    return now.toTimeString().slice(0, 5);
  }

  updateForm(field: string, value: any): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  // CRUD
  openCreateForm(): void {
    this.formMode.set('create');
    this.editingId.set(null);
    const v = this.vehicleService.defaultVehicle();
    this.form.set({
      zoneId: this.form().zoneId,
      vehicleId: v?.id || '',
      date: this.getTodayDate(),
      time: this.getNextHalfHour(),
      duration: 60,
      notes: '',
      spotPreference: 'any'
    });
    this.showForm.set(true);
  }

  openEditForm(res: Reservation): void {
    this.formMode.set('edit');
    this.editingId.set(res.id);
    const d = new Date(res.scheduledTime);
    this.form.set({
      zoneId: res.zoneId,
      vehicleId: res.vehicleId,
      date: d.toISOString().split('T')[0],
      time: d.toTimeString().slice(0, 5),
      duration: Math.round((new Date(res.expiresAt).getTime() - d.getTime()) / 60000) - 15,
      notes: '',
      spotPreference: 'any'
    });
    this.showForm.set(true);
  }

  submitForm(): void {
    const f = this.form();
    if (!f.vehicleId || !f.zoneId) return;

    const scheduledDate = new Date(`${f.date}T${f.time}`);
    const minutesFromNow = Math.round((scheduledDate.getTime() - Date.now()) / 60000);

    if (this.formMode() === 'edit' && this.editingId()) {
      // Edit: cancel old + create new
      this.reservationService.cancelReservation(this.editingId()!).subscribe(() => {
        this.reservationService.createReservation(f.zoneId, f.vehicleId, minutesFromNow).subscribe(() => {
          this.showFormSuccess('Reserva actualizada correctamente');
        });
      });
    } else {
      this.reservationService.createReservation(f.zoneId, f.vehicleId, minutesFromNow).subscribe(() => {
        this.showFormSuccess('Reserva creada correctamente');
      });
    }
  }

  confirmCancel(id: string): void {
    this.confirmCancelId.set(id);
  }

  doCancel(): void {
    const id = this.confirmCancelId();
    if (!id) return;
    this.reservationService.cancelReservation(id).subscribe(() => {
      this.confirmCancelId.set(null);
      this.showFormSuccess('Reserva cancelada');
    });
  }

  showFormSuccess(msg: string): void {
    this.showForm.set(false);
    this.successMsg.set(msg);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }

  // Helpers
  getZoneName(zoneId: string): string {
    return this.zones().find(z => z.id === zoneId)?.name || zoneId;
  }

  getZoneAvailable(zoneId: string): number {
    return this.zones().find(z => z.id === zoneId)?.availableSpots || 0;
  }

  getVehiclePlate(vehicleId: string): string {
    return this.vehicles().find(v => v.id === vehicleId)?.plate || '—';
  }

  getVehicleIcon(vehicleId: string): string {
    const v = this.vehicles().find(ve => ve.id === vehicleId);
    return this.vehicleService.getVehicleIcon(v?.type || 'car');
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'Confirmada', ACTIVE: 'Activa',
      COMPLETED: 'Completada', EXPIRED: 'Expirada', CANCELLED: 'Cancelada', PENDING: 'Pendiente'
    };
    return map[status] || status;
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'badge-info', ACTIVE: 'badge-success',
      COMPLETED: 'badge-neutral', EXPIRED: 'badge-warning', CANCELLED: 'badge-danger'
    };
    return map[status] || 'badge-neutral';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'event_available', ACTIVE: 'local_parking',
      COMPLETED: 'check_circle', EXPIRED: 'schedule', CANCELLED: 'cancel'
    };
    return map[status] || 'help';
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-CO', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatDuration(start: Date, end: Date): string {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? mins % 60 + 'min' : ''}`;
  }

  canEdit(res: Reservation): boolean {
    return res.status === 'CONFIRMED';
  }

  canCancel(res: Reservation): boolean {
    return res.status === 'CONFIRMED' || res.status === 'ACTIVE';
  }

  readonly filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'CONFIRMED', label: 'Confirmadas' },
    { value: 'ACTIVE', label: 'Activas' },
    { value: 'COMPLETED', label: 'Completadas' },
    { value: 'CANCELLED', label: 'Canceladas' }
  ];

  readonly durationOptions = [
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1h 30min' },
    { value: 120, label: '2 horas' },
    { value: 180, label: '3 horas' },
    { value: 240, label: '4 horas' },
  ];
}
