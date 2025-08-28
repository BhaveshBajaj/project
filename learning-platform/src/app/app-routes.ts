import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CourseSearchComponent } from './components/course-search/course-search';
import { CourseDetailsComponent } from './components/course-details/course-details';
import { AuthorComponent } from './components/author/author';
import { BlogDetailComponent } from './components/blog-detail/blog-detail';
import { BlogEditComponent } from './components/blog-edit/blog-edit';
import { CourseCreationComponent } from './components/course-creation/course-creation';
import { AdminProfileComponent } from './components/admin-profile/admin-profile';
import { UserManagementComponent } from './components/user-management/user-management';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'search', 
    component: CourseSearchComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'course/:id', 
    component: CourseDetailsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'author/:id', 
    component: AuthorComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin-profile', 
    component: AdminProfileComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'Admin' }
  },
  { 
    path: 'admin/user-management', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'Admin' }
  },
  { 
    path: 'blog/:id', 
    component: BlogDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'blog/:id/edit', 
    component: BlogEditComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'Author' }
  },
  { 
    path: 'create-course', 
    component: CourseCreationComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: 'Admin' }
  },
  { path: '**', redirectTo: '/login' }
];
