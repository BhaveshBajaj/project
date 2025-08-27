import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Enrollment } from '../models/enrollment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const response = await fetch('/assets/data.json');
      const data = await response.json();
      this.users = data.users;
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  getUserStats(userId: number): Observable<{
    goals: number;
    enrolledCourses: number;
    certificatesEarned: number;
  }> {
    // Simulate user statistics
    const stats = {
      goals: 3,
      enrolledCourses: 8,
      certificatesEarned: 2
    };
    return of(stats);
  }

  getUserProgress(userId: number): Observable<Enrollment[]> {
    // This would typically come from the course service
    // For now, return mock data
    const mockEnrollments: Enrollment[] = [
      { courseId: 101, progressPercent: 90 },
      { courseId: 102, progressPercent: 80 },
      { courseId: 103, progressPercent: 100 }
    ];
    return of(mockEnrollments);
  }

  updateUserProfile(userId: number, updates: Partial<User>): Observable<boolean> {
    // Simulate profile update
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      return of(true);
    }
    return of(false);
  }
}
