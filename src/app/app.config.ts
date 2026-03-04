import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

// Repositories
import { ParkingRepository } from '@domain/repositories/parking.repository';
import { QueueRepository } from '@domain/repositories/queue.repository';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { AnalyticsRepository } from '@domain/repositories/analytics.repository';

// Firebase Adapters
import { FirebaseParkingAdapter } from '@infrastructure/adapters/firebase/firebase-parking.adapter';
import { FirebaseQueueAdapter } from '@infrastructure/adapters/firebase/firebase-queue.adapter';
import { FirebaseAuthAdapter } from '@infrastructure/adapters/firebase/firebase-auth.adapter';
import { MockAnalyticsAdapter } from '@infrastructure/adapters/firebase/mock-analytics.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(withEventReplay()),
    
    // Dependency Injection - Clean Architecture
    { provide: ParkingRepository, useClass: FirebaseParkingAdapter },
    { provide: QueueRepository, useClass: FirebaseQueueAdapter },
    { provide: AuthRepository, useClass: FirebaseAuthAdapter },
    { provide: AnalyticsRepository, useClass: MockAnalyticsAdapter }
  ]
};
