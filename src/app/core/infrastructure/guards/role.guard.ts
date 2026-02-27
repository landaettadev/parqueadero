import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authRepo = inject(AuthRepository);
  const router = inject(Router);
  
  const requiredRole = route.data['role'] as string;

  return authRepo.getCurrentUser().pipe(
    map(user => {
      if (user && user.role === requiredRole) {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    })
  );
};
