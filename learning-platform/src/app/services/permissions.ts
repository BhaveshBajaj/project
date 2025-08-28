import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private authService: AuthService) {}

  /**
   * Check if current user can create courses (Admin only)
   */
  canCreateCourse(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Admin';
  }

  /**
   * Check if current user can edit blogs (Author or Admin)
   */
  canEditBlogs(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Author' || user?.role === 'Admin';
  }

  /**
   * Check if current user can access admin features (Admin only)
   */
  canAccessAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Admin';
  }

  /**
   * Check if current user can manage users (Admin only)
   */
  canManageUsers(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Admin';
  }

  /**
   * Check if current user can edit a specific blog (Author of the blog or Admin)
   */
  canEditBlog(blogAuthorId: number): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    
    return user.role === 'Admin' || (user.role === 'Author' && user.id === blogAuthorId);
  }

  /**
   * Get user role display name
   */
  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'Admin': return 'Administrator';
      case 'Author': return 'Author';
      case 'Learner': return 'Learner';
      default: return role;
    }
  }

  /**
   * Get role color for UI
   */
  getRoleColor(role: string): string {
    switch (role) {
      case 'Admin': return '#fbbf24'; // Yellow
      case 'Author': return '#10b981'; // Green
      case 'Learner': return '#3b82f6'; // Blue
      default: return '#6b7280'; // Gray
    }
  }
}
