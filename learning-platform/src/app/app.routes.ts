import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CourseSearchComponent } from './components/course-search/course-search';
import { CourseDetailsComponent } from './components/course-details/course-details';
import { AuthorComponent } from './components/author/author';
import { BlogDetailComponent } from './components/blog-detail/blog-detail';
import { CourseCreationComponent } from './components/course-creation/course-creation';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'search', component: CourseSearchComponent },
  { path: 'course/:id', component: CourseDetailsComponent },
  { path: 'author/:id', component: AuthorComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'create-course', component: CourseCreationComponent },
  { path: '**', redirectTo: '/login' }
];
