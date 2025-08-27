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
    email: 'nathan.william@deloitte.com',
    password: 'password',
    rememberMe: false
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred during login';
        console.error('Login error:', error);
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
