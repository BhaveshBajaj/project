import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  signupData = {
    username: '',
    email: '',
    password: '',
    agreeToTerms: false
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.signupData.agreeToTerms) {
      this.errorMessage = 'Please agree to the terms and conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupData).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred during registration';
        console.error('Signup error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
