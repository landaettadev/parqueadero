import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParkingRepository } from '@domain/repositories/parking.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAvailabilityUseCase {
  private parkingRepo = inject(ParkingRepository);

  execute(): Observable<{ total: number; occupied: number; available: number }> {
    return this.parkingRepo.getTotalAvailability();
  }
}
