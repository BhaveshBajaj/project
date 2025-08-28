import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent implements OnInit {
  currentUser: User | null = null;
  activeTab = 'user-management';
  userSearchQuery = '';
  showEditModal = false;
  selectedUser: any = null;
  
  users: any[] = [];
  filteredUsers: any[] = [];
  totalUsers = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.role !== 'Admin') {
        // Redirect non-admin users
        this.router.navigate(['/dashboard']);
      }
    });

    // Clear cache to force fresh API call
    this.userService.clearCache();
    
    // Load users from data.json
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getEnhancedUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.totalUsers = users.length;
        
        // If no users loaded, try to get basic users
        if (users.length === 0) {
          this.loadBasicUsers();
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Try to load basic users as fallback
        this.loadBasicUsers();
      }
    });
  }

  private loadBasicUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        if (users.length > 0) {
          // Convert basic users to enhanced format
          this.users = users.map(user => ({
            ...user,
            firstName: user.fullName.split(' ')[0] || '',
            middleName: user.fullName.split(' ').slice(1).join(' ') || '',
            joinedDate: new Date(user.joinDate).toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: 'numeric' 
            }),
            sinceDate: new Date(user.joinDate).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            learningHours: '0 hrs/week',
            pendingCourses: 0,
            ratedCourses: 0,
            learningHistory: []
          }));
          this.filteredUsers = this.users;
          this.totalUsers = this.users.length;
        }
      },
      error: (error) => {
        console.error('Error loading basic users:', error);
        this.users = [];
        this.filteredUsers = [];
        this.totalUsers = 0;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onUserSearch(): void {
    if (this.userSearchQuery.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.fullName.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.userSearchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  editUser(user: any): void {
    this.selectedUser = { ...user }; // Create a copy to avoid direct modification
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveChanges(): void {
    if (this.selectedUser) {
      // Update the user data
      const updates = {
        fullName: `${this.selectedUser.firstName} ${this.selectedUser.middleName}`.trim(),
        email: this.selectedUser.email,
        bio: this.selectedUser.bio,
        location: this.selectedUser.location
      };

      this.userService.updateUser(this.selectedUser.id, updates).subscribe({
        next: (updatedUser) => {
          // Update the local user list
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.filteredUsers = [...this.users];
          }
          
          alert('Changes saved successfully!');
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Error saving changes. Please try again.');
        }
      });
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'Author':
        return 'role-author';
      case 'Admin':
        return 'role-admin';
      case 'Learner':
        return 'role-normal-user';
      default:
        return 'role-default';
    }
  }

  getCompletionStatusClass(completion: number): string {
    if (completion === 100) return 'status-complete';
    if (completion >= 60) return 'status-in-progress';
    return 'status-started';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Method to manually refresh data
  refreshData(): void {
    console.log('Manually refreshing data...');
    this.userService.clearCache();
    this.loadUsers();
  }

  goBack(): void {
    this.router.navigate(['/admin-profile']);
  }
}
