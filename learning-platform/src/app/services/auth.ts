import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

interface AuthData {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private authToken: string | null = null;
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly USERS_CACHE_KEY = 'usersCache';

  constructor(private http: HttpClient) {
    this.initializeAuth();
    // Clear cache in development to ensure fresh data loading
    if (!localStorage.getItem(this.USERS_CACHE_KEY)) {
      console.log('First time loading - no cache found');
    }
  }

  private initializeAuth(): void {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    const storedToken = localStorage.getItem(this.AUTH_TOKEN_KEY);
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.authToken = storedToken;
    }
  }

  private loadUsers(): Observable<User[]> {
    // First check cache
    const cachedUsers = localStorage.getItem(this.USERS_CACHE_KEY);
    if (cachedUsers) {
      console.log('Loading users from cache');
      return of(JSON.parse(cachedUsers));
    }

    console.log('Loading users from data.json...');
    // Load from public/data.json
    return this.http.get<AuthData>('data.json').pipe(
      map(data => {
        console.log('Successfully loaded users:', data.users.length);
        // Cache users for offline use
        localStorage.setItem(this.USERS_CACHE_KEY, JSON.stringify(data.users));
        return data.users;
      }),
      catchError(error => {
        console.error('Failed to load users data:', error);
        console.error('Error details:', error.message, error.status);
        
        // Provide fallback users for demo purposes
        const fallbackUsers: User[] = [
          {
            id: 1,
            username: 'demo',
            email: 'demo@example.com',
            password: 'hashed_password',
            fullName: 'Demo User',
            track: 'Learning Demo',
            avatarUrl: 'https://i.pravatar.cc/150?u=demo',
            joinDate: new Date().toISOString(),
            role: 'Learner',
            bio: 'Demo user for testing',
            location: 'Demo Location'
          }
        ];
        
        console.log('Using fallback users for demo');
        localStorage.setItem(this.USERS_CACHE_KEY, JSON.stringify(fallbackUsers));
        return of(fallbackUsers);
      })
    );
  }

  private generateToken(user: User): string {
    // Simple token generation - in production, this would be done server-side
    const tokenData = {
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
      expiresIn: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(tokenData));
  }

  private validateToken(): boolean {
    if (!this.authToken) return false;
    
    try {
      const tokenData = JSON.parse(atob(this.authToken));
      return tokenData.expiresIn > Date.now();
    } catch {
      return false;
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.loadUsers().pipe(
      map(users => {
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          throw new Error('User not found');
        }

        // In a real app, you'd hash the password and compare
        // For demo purposes, we'll use simple string comparison
        // You can use any password for existing users since data.json has "hashed_password"
        if (password.length < 6) {
          throw new Error('Invalid password');
        }

        // Generate auth token
        this.authToken = this.generateToken(user);
        
        // Store in localStorage
        localStorage.setItem(this.AUTH_TOKEN_KEY, this.authToken);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        
        // Update current user
        this.currentUserSubject.next(user);
        
        return true;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  signup(userData: { username: string; email: string; password: string; fullName?: string }): Observable<boolean> {
    return this.loadUsers().pipe(
      map(users => {
        // Check if user already exists
        const existingUser = users.find(u => 
          u.email.toLowerCase() === userData.email.toLowerCase() || 
          u.username.toLowerCase() === userData.username.toLowerCase()
        );

        if (existingUser) {
          throw new Error('User already exists with this email or username');
        }

        // Validate password strength
        if (userData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        // Generate unique ID based on existing users
        const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
        const newUserId = maxId + 1;

        // Create new user
        const newUser: User = {
          id: newUserId,
          username: userData.username,
          email: userData.email,
          password: 'hashed_password', // In real app, this would be hashed
          fullName: userData.fullName || userData.username,
          track: null,
          avatarUrl: `https://i.pravatar.cc/150?u=${userData.username}`,
          joinDate: new Date().toISOString(),
          role: 'Learner',
          bio: null,
          location: null
        };

        // Add to users cache - this becomes our persistent storage
        const updatedUsers = [...users, newUser];
        localStorage.setItem(this.USERS_CACHE_KEY, JSON.stringify(updatedUsers));

        // Also create initial enrollment data for the new user
        this.createInitialUserEnrollments(newUserId);

        // Generate auth token
        this.authToken = this.generateToken(newUser);

        // Store in localStorage
        localStorage.setItem(this.AUTH_TOKEN_KEY, this.authToken);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));

        // Update current user
        this.currentUserSubject.next(newUser);

        console.log('New user created successfully:', newUser);
        console.log('Total users in system:', updatedUsers.length);

        return true;
      }),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => error);
      })
    );
  }

  private createInitialUserEnrollments(userId: number): void {
    // Get existing enrollments or create empty object
    const enrollmentsKey = 'userEnrollmentsCache';
    const existingEnrollments = JSON.parse(localStorage.getItem(enrollmentsKey) || '{}');
    
    // Create initial enrollments for new user (could be empty or sample courses)
    existingEnrollments[userId.toString()] = [
      // You can add some default course enrollments here if needed
      // { courseId: 101, progressPercent: 0 }
    ];
    
    localStorage.setItem(enrollmentsKey, JSON.stringify(existingEnrollments));
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.authToken = null;
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null && this.validateToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    return this.validateToken() ? this.authToken : null;
  }

  refreshUserData(): Observable<User | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return of(null);
    }

    return this.loadUsers().pipe(
      map(users => {
        const updatedUser = users.find(u => u.id === currentUser.id);
        if (updatedUser) {
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
          return updatedUser;
        }
        return currentUser;
      }),
      catchError(() => of(currentUser))
    );
  }

  // Clear cache (useful for development)
  clearCache(): void {
    localStorage.removeItem(this.USERS_CACHE_KEY);
    localStorage.removeItem('userEnrollmentsCache');
  }

  // Get all registered users (including newly created ones)
  getAllRegisteredUsers(): Observable<User[]> {
    return this.loadUsers();
  }

  // Check if user data is persisted
  getUserCount(): Observable<number> {
    return this.loadUsers().pipe(
      map(users => users.length)
    );
  }

  // Method to manually save current user state (for debugging)
  saveUserData(): void {
    const users = JSON.parse(localStorage.getItem(this.USERS_CACHE_KEY) || '[]');
    console.log('Current registered users:', users);
    console.log('User count:', users.length);
  }
}
