import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.scss'
})
export class AdminProfileComponent implements OnInit {
  currentUser: User | null = null;

  userManagementAction = {
    id: 'user-management',
    title: 'User Management 1234',
    description: 'Manage users, roles, and permissions',
    icon: '👥',
    count: 1234,
    route: '/admin/users'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.role !== 'Admin') {
        // Redirect non-admin users to regular profile
        this.router.navigate(['/author', user.id]);
      }
    });
  }

  onActionClick(action: any): void {
    if (action.id === 'user-management') {
      this.router.navigate(['/admin/user-management']);
    } else {
      // For demo purposes, show an alert
      alert(`Navigating to ${action.title}`);
      // In a real application, this would navigate to the actual route
      // this.router.navigate([action.route]);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
