import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CourseSearchComponent } from './components/course-search/course-search';
import { CourseDetailsComponent } from './components/course-details/course-details';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'search', component: CourseSearchComponent },
  { path: 'course/:id', component: CourseDetailsComponent },
  { path: '**', redirectTo: '/login' }
];
