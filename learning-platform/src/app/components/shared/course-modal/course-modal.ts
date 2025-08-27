import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseCardComponent } from '../course-card/course-card';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-course-modal',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-modal.html',
  styleUrl: './course-modal.scss'
})
export class CourseModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = 'All Courses';
  @Input() courses: Course[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() courseSelected = new EventEmitter<Course>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Handle escape key to close modal
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onCourseClick(course: Course): void {
    this.courseSelected.emit(course);
  }

  onAuthorClick(course: Course, event: Event): void {
    event.stopPropagation(); // Prevent course click
    this.router.navigate(['/author', course.authorId]);
  }
}
