import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { HeaderComponent } from '../shared/header/header';
import { CourseCardComponent } from '../shared/course-card/course-card';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, CourseCardComponent],
  templateUrl: './course-search.html',
  styleUrl: './course-search.scss'
})
export class CourseSearchComponent implements OnInit {
  searchQuery = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading = false;

  // Filter options
  filters = {
    difficulty: '',
    provider: '',
    rating: 0,
    isPaid: false
  };

  difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  providerOptions = ['Google', 'LinkedIn', 'IBM'];
  ratingOptions = [5, 4, 3, 2, 1];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadCourses();
    });
  }

  private loadCourses(): void {
    this.isLoading = true;
    
    if (this.searchQuery) {
      this.courseService.searchCourses(this.searchQuery).subscribe(courses => {
        this.courses = courses;
        this.applyFilters();
        this.isLoading = false;
      });
    } else {
      this.courseService.getAllCourses().subscribe(courses => {
        this.courses = courses;
        this.applyFilters();
        this.isLoading = false;
      });
    }
  }

  onSearch(): void {
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      // Difficulty filter
      if (this.filters.difficulty && course.difficulty !== this.filters.difficulty) {
        return false;
      }

      // Provider filter
      if (this.filters.provider && course.provider.name !== this.filters.provider) {
        return false;
      }

      // Rating filter
      if (this.filters.rating > 0 && course.rating < this.filters.rating) {
        return false;
      }

      return true;
    });
  }

  clearFilters(): void {
    this.filters = {
      difficulty: '',
      provider: '',
      rating: 0,
      isPaid: false
    };
    this.applyFilters();
  }

  getFilteredCount(): number {
    return this.filteredCourses.length;
  }
}
