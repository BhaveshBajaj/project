import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  imageLoadError = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = 'Invalid email or password. Please check your credentials.';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred during login. Please try again.';
        console.error('Login error:', error);
        
        // Provide helpful hints for common issues
        if (error.message === 'User not found') {
          this.errorMessage = 'No account found with this email. Please check your email or sign up for a new account.';
        } else if (error.message.includes('Password must be at least 6 characters')) {
          this.errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message === 'Invalid password') {
          this.errorMessage = 'Incorrect password. Please try again.';
        }
      }
    });
  }

  private validateForm(): boolean {
    this.errorMessage = '';

    if (!this.loginData.email) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.isValidEmail(this.loginData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.loginData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.loginData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onImageError(event: any): void {
    console.log('Image failed to load, showing fallback');
    this.imageLoadError = true;
    event.target.style.display = 'none';
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
