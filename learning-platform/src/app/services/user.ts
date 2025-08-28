import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { AppData } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private userEnrollments: { [userId: string]: { courseId: number; progressPercent: number }[] } = {};
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // First check for cached users (includes newly registered users)
      const cachedUsers = localStorage.getItem('usersCache');
      const cachedEnrollments = localStorage.getItem('userEnrollmentsCache');
      
      if (cachedUsers) {
        this.users = JSON.parse(cachedUsers);
        this.userEnrollments = cachedEnrollments ? JSON.parse(cachedEnrollments) : {};
        this.usersSubject.next(this.users);
        console.log('Loaded users from cache:', this.users.length);
      } else {
        // Load from data.json initially
        this.http.get<AppData>('data.json').subscribe({
          next: (data) => {
            this.users = data.users || [];
            this.userEnrollments = data.userEnrollments || {};
            
            // Cache the initial data
            localStorage.setItem('usersCache', JSON.stringify(this.users));
            localStorage.setItem('userEnrollmentsCache', JSON.stringify(this.userEnrollments));
            
            this.usersSubject.next(this.users);
            console.log('Loaded users from data.json:', this.users.length);
          },
          error: (error) => {
            console.error('Failed to load users from data.json:', error);
            this.users = this.getMockUsers();
            this.usersSubject.next(this.users);
          }
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.users = this.getMockUsers();
      this.usersSubject.next(this.users);
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
    totalGoals: number;
    enrolledCourses: number;
  }> {
    // Get user enrollments from data.json
    const userEnrollments = this.userEnrollments[userId.toString()] || [];
    
    const completedCourses = userEnrollments.filter(e => e.progressPercent === 100).length;
    const inProgressCourses = userEnrollments.filter(e => e.progressPercent > 0 && e.progressPercent < 100).length;
    const enrolledCourses = userEnrollments.length;
    
    // Calculate stats based on real data
    const stats = {
      totalCourses: enrolledCourses,
      completedCourses: completedCourses,
      inProgressCourses: inProgressCourses,
      totalHours: enrolledCourses * 12, // Estimate 12 hours per course
      certificates: completedCourses, // One certificate per completed course
      totalGoals: Math.max(3, Math.ceil(enrolledCourses * 0.3)), // 30% of enrolled courses as goals
      enrolledCourses: enrolledCourses
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
    return this.users$;
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

  // Refresh user data from cache (useful after new user registration)
  refreshUserData(): void {
    const cachedUsers = localStorage.getItem('usersCache');
    const cachedEnrollments = localStorage.getItem('userEnrollmentsCache');
    
    if (cachedUsers) {
      this.users = JSON.parse(cachedUsers);
      this.userEnrollments = cachedEnrollments ? JSON.parse(cachedEnrollments) : {};
      console.log('Refreshed user data - Total users:', this.users.length);
    }
  }

  // Get total user count (including newly registered)
  getTotalUserCount(): number {
    return this.users.length;
  }

  // Get user enrollments from the JSON data
  getUserEnrollments(userId: number): Observable<{ courseId: number; progressPercent: number }[]> {
    const enrollments = this.userEnrollments[userId.toString()] || [];
    return of(enrollments);
  }

  // Get authors from users with role 'Author'
  getAuthors(): Observable<User[]> {
    const authors = this.users.filter(user => user.role === 'Author');
    return of(authors);
  }
}