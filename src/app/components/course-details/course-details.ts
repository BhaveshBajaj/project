import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { HeaderComponent } from '../shared/header/header';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetailsComponent implements OnInit {
  course: Course | undefined;
  isLoading = true;
  error = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = +params['id'];
      this.loadCourse(courseId);
    });
  }

  private loadCourse(courseId: number): void {
    this.isLoading = true;
    this.error = false;

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars;
  }

  formatReviewCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  enrollInCourse(): void {
    if (this.course) {
      console.log('Enrolling in course:', this.course.title);
      // Here you would typically call a service to enroll the user
      alert('Successfully enrolled in the course!');
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
