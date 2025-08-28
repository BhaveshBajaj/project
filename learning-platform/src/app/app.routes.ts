import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CourseSearchComponent } from './components/course-search/course-search';
import { CourseDetailsComponent } from './components/course-details/course-details';
import { AuthorComponent } from './components/author/author';
import { BlogDetailComponent } from './components/blog-detail/blog-detail';
import { CourseCreationComponent } from './components/course-creation/course-creation';
import { AuthGuard } from './guards/auth.guard';

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
    path: 'blog/:id', 
    component: BlogDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'create-course', 
    component: CourseCreationComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
