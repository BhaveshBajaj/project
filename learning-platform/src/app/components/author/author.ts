import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseCardComponent } from '../shared/course-card/course-card';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { PermissionsService } from '../../services/permissions';
import { Course } from '../../models/course';
import { User } from '../../models/user';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './author.html',
  styleUrl: './author.scss'
})
export class AuthorComponent implements OnInit {
  author: User | null = null;
  authorCourses: Course[] = [];
  totalStudents = 0;
  totalRating = 0;
  isLoading = true;
  
  // Tab state
  activeTab = 'courses';
  
  // Mock stats for demonstration
  authorStats = {
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0,
    totalReviews: 0,
    yearsExperience: 5,
    achievements: [
      'Best Instructor 2023',
      'Most Popular Course Creator',
      'Expert in Data Science'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const authorId = Number(params['id']);
      if (authorId) {
        this.loadAuthorData(authorId);
      }
    });
  }

  private loadAuthorData(authorId: number): void {
    this.isLoading = true;
    
    // Load author profile
    this.userService.getUserById(authorId).subscribe({
      next: (author) => {
        if (author) {
          this.author = author;
          this.loadAuthorCourses(authorId);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error loading author:', error);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private loadAuthorCourses(authorId: number): void {
    this.courseService.getCoursesByAuthor(authorId).subscribe({
      next: (courses) => {
        this.authorCourses = courses;
        this.calculateStats(courses);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading author courses:', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStats(courses: Course[]): void {
    this.authorStats.totalCourses = courses.length;
    
    if (courses.length > 0) {
      // Calculate total students
      this.authorStats.totalStudents = courses.reduce((sum, course) => 
        sum + (course.studentsCount || 0), 0);
      
      // Calculate average rating
      const totalRating = courses.reduce((sum, course) => sum + course.rating, 0);
      this.authorStats.averageRating = totalRating / courses.length;
      
      // Calculate total reviews
      this.authorStats.totalReviews = courses.reduce((sum, course) => 
        sum + (course.reviewsCount || 0), 0);
    }
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onCourseClick(course: Course): void {
    this.router.navigate(['/course', course.id]);
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getExperienceText(): string {
    const years = this.authorStats.yearsExperience;
    return years === 1 ? '1 year' : `${years} years`;
  }

  getUniqueSkills(): string[] {
    const allSkills = this.authorCourses.flatMap(course => course.skills);
    return Array.from(new Set(allSkills)).slice(0, 10); // Limit to 10 skills
  }

  isCurrentUser(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!(currentUser && this.author && currentUser.id === this.author.id);
  }

  navigateToCreateCourse(): void {
    this.router.navigate(['/create-course']);
  }

  getRoleDisplayName(role: string): string {
    return this.permissionsService.getRoleDisplayName(role);
  }

  getRoleColor(role: string): string {
    return this.permissionsService.getRoleColor(role);
  }
}
