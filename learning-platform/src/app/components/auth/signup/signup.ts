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
    confirmPassword: '',
    agreeToTerms: false
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

    this.authService.signup({
      username: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password,
      fullName: this.signupData.username
    }).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          this.successMessage = 'Account created successfully! User data has been stored. Redirecting...';
          
          // Log user creation for debugging
          console.log('New user registered successfully');
          console.log('Username:', this.signupData.username);
          console.log('Email:', this.signupData.email);
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }

  private validateForm(): boolean {
    this.errorMessage = '';

    // Username validation
    if (!this.signupData.username) {
      this.errorMessage = 'Username is required';
      return false;
    }

    if (this.signupData.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long';
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(this.signupData.username)) {
      this.errorMessage = 'Username can only contain letters, numbers, and underscores';
      return false;
    }

    // Email validation
    if (!this.signupData.email) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.isValidEmail(this.signupData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    // Password validation
    if (!this.signupData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    // Confirm password validation
    if (!this.signupData.confirmPassword) {
      this.errorMessage = 'Please confirm your password';
      return false;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    // Terms agreement validation
    if (!this.signupData.agreeToTerms) {
      this.errorMessage = 'Please agree to the terms and conditions';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  passwordsMatch(): boolean {
    if (!this.signupData.password || !this.signupData.confirmPassword) {
      return true; // Don't show mismatch if either field is empty
    }
    return this.signupData.password === this.signupData.confirmPassword;
  }

  getPasswordStrengthClass(): string {
    const strength = this.calculatePasswordStrength();
    if (strength < 25) return 'weak';
    if (strength < 50) return 'fair';
    if (strength < 75) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.calculatePasswordStrength();
    if (strength < 25) return 'Weak password';
    if (strength < 50) return 'Fair password';
    if (strength < 75) return 'Good password';
    return 'Strong password';
  }

  private calculatePasswordStrength(): number {
    const password = this.signupData.password;
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 10;
    if (password.length >= 12) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 15; // lowercase
    if (/[A-Z]/.test(password)) strength += 15; // uppercase
    if (/[0-9]/.test(password)) strength += 15; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // special characters

    return Math.min(strength, 100);
  }

  onImageError(event: any): void {
    console.log('Image failed to load, showing fallback');
    this.imageLoadError = true;
    event.target.style.display = 'none';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
