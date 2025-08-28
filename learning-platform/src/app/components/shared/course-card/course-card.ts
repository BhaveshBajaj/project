import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss'
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() showProgress = false;
  @Input() progressPercent = 0;

  constructor(private router: Router) {}

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

  onCourseClick(): void {
    this.router.navigate(['/course', this.course.id]);
  }

  onAuthorClick(event: Event): void {
    event.stopPropagation(); // Prevent course click
    this.router.navigate(['/author', this.course.authorId]);
  }

  onImageError(event: any): void {
    // Fallback to a default course image if the original fails to load
    event.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&auto=format';
  }
}
