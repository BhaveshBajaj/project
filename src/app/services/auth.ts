import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulate API call - in real app, this would be an HTTP request
    if (email === 'nathan.william@deloitte.com' && password === 'password') {
      const user: User = {
        id: 1,
        username: 'nwilliam',
        email: email,
        password: password,
        fullName: 'Nathan William',
        track: 'DC Software Engineer II',
        avatarUrl: 'https://i.pravatar.cc/150?u=nwilliam',
        joinDate: '2021-08-14T00:00:00.000Z',
        role: 'Learner',
        bio: 'Passionate learner and developer',
        location: 'New York, USA'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(true);
    }
    return of(false);
  }

  signup(userData: Partial<User>): Observable<boolean> {
    // Simulate API call for signup
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      username: userData.username || '',
      email: userData.email || '',
      password: userData.password || '',
      fullName: userData.fullName || '',
      track: null,
      avatarUrl: 'https://i.pravatar.cc/150?u=' + (userData.username || 'user'),
      joinDate: new Date().toISOString(),
      role: 'Learner',
      bio: null,
      location: null
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    return of(true);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
