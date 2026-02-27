import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '@domain/repositories/auth.repository';

export const authGuard: CanActivateFn = (route, state) => {
  const authRepo = inject(AuthRepository);
  const router = inject(Router);

  if (authRepo.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
