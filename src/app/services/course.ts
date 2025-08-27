import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course';
import { Enrollment, UserEnrollments } from '../models/enrollment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private enrollments: UserEnrollments = {};

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const response = await fetch('/assets/data.json');
      const data = await response.json();
      this.courses = data.courses;
      this.enrollments = data.userEnrollments;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  getAllCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  getCourseById(id: number): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return of(course);
  }

  searchCourses(query: string): Observable<Course[]> {
    const filtered = this.courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      course.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered);
  }

  filterCourses(filters: {
    difficulty?: string;
    provider?: string;
    rating?: number;
    isPaid?: boolean;
  }): Observable<Course[]> {
    let filtered = this.courses;

    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }

    if (filters.provider) {
      filtered = filtered.filter(course => course.provider.name === filters.provider);
    }

    if (filters.rating) {
      filtered = filtered.filter(course => course.rating >= filters.rating!);
    }

    return of(filtered);
  }

  getUserEnrollments(userId: number): Observable<Enrollment[]> {
    const userEnrollments = this.enrollments[userId.toString()] || [];
    return of(userEnrollments);
  }

  getEnrolledCourses(userId: number): Observable<Course[]> {
    const userEnrollments = this.enrollments[userId.toString()] || [];
    const enrolledCourses = userEnrollments.map(enrollment => 
      this.courses.find(course => course.id === enrollment.courseId)
    ).filter(course => course !== undefined) as Course[];
    
    return of(enrolledCourses);
  }

  getLastViewedCourses(userId: number): Observable<Course[]> {
    // Simulate last viewed courses - in real app, this would come from user activity
    return this.getEnrolledCourses(userId);
  }

  getNewlyLaunchedCourses(): Observable<Course[]> {
    // Return courses published in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newlyLaunched = this.courses.filter(course => 
      new Date(course.publishedDate) >= thirtyDaysAgo
    );
    
    return of(newlyLaunched);
  }
}
