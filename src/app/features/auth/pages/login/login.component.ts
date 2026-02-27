import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { ROUTES } from '@core/constants/routes.constants';
import { LABELS } from '@shared/constants/labels.constants';
import { IMAGES } from '@shared/constants/images.constants';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  private router = inject(Router);

  readonly labels = LABELS;
  readonly images = IMAGES;
  readonly currentYear = new Date().getFullYear();

  // Signals
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['user@eafit.edu.co'],
    password: ['123456']
  });

  onSubmit(): void {
    this.isLoading.set(true);
    const { email } = this.loginForm.value;

    // Bypass: Permitir acceso directo sin Firebase
    setTimeout(() => {
      this.isLoading.set(false);
      if (email && email.includes('admin')) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 300);
  }

  // Getters para validación
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
