import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

export interface RoleGuardData {
  requiredRole: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: any): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRole = route.data?.requiredRole;
        if (!requiredRole) {
          return true; // No role requirement specified
        }

        if (user.role === requiredRole || user.role === 'Admin') {
          return true; // User has required role or is admin
        }

        // User doesn't have required role
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}
