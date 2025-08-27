import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

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
      // Use mock data for now
      this.users = this.getMockUsers();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private getMockUsers(): User[] {
    return [
      {
        id: 1,
        username: "nwilliam",
        email: "nathan.william@deloitte.com",
        password: "password",
        fullName: "Nathan William",
        track: "DC Software Engineer II",
        avatarUrl: "https://i.pravatar.cc/150?u=nwilliam",
        joinDate: "2021-08-14T00:00:00.000Z",
        role: "Learner",
        bio: "Passionate learner and developer",
        location: "New York, USA"
      },
      {
        id: 2,
        username: "smaarek",
        email: "stephane.maarek@example.com",
        password: "password",
        fullName: "Stephane Maarek",
        track: "AWS Certified Cloud Practitioner",
        avatarUrl: "https://i.pravatar.cc/150?u=smaarek",
        joinDate: "2020-05-20T00:00:00.000Z",
        role: "Author",
        bio: "Solutions architect and cloud expert",
        location: "New York, USA"
      }
    ];
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  getUserStats(userId: number): Observable<{
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalHours: number;
    certificates: number;
  }> {
    // Simulate user stats - in a real app, this would come from the backend
    const stats = {
      totalCourses: 12,
      completedCourses: 8,
      inProgressCourses: 4,
      totalHours: 156,
      certificates: 6
    };
    return of(stats);
  }

  updateUser(userId: number, userData: Partial<User>): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      return of(true);
    }
    return of(false);
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  searchUsers(query: string): Observable<User[]> {
    const filteredUsers = this.users.filter(user =>
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredUsers);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return of(this.users.filter(user => user.role === role));
  }
}