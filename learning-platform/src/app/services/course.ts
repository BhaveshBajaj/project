import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course';
import { Enrollment, UserEnrollments } from '../models/enrollment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private enrollments: UserEnrollments[] = [];
  private dataLoaded = false;

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // For now, use mock data instead of fetching from the JSON file
      // This avoids issues with the dev server not serving the assets correctly
      this.courses = this.getMockCourses();
      this.enrollments = this.getMockEnrollments();
      this.dataLoaded = true;
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  }

  private getMockCourses(): Course[] {
    return [
      {
        id: 101,
        title: "Google Data Analytics Course-1",
        subtitle: "Master data analytics with Google's comprehensive program",
        authorId: 2,
        provider: {
          name: "Google",
          logoUrl: "https://i.imgur.com/your-google-logo.png"
        },
        thumbnailUrl: "https://i.imgur.com/3q6CqYq.png",
        rating: 4.8,
        reviewsCount: 1250,
        studentsCount: 25000,
        duration: "6 months",
        lastUpdated: "2024-01-15",
        difficulty: "Beginner",
        price: 49,
        originalPrice: 99,
        discount: 50,
        languages: ["English"],
        subtitles: ["English", "Spanish"],
        skills: ["Data Analysis", "Google Analytics", "Data Visualization"],
        category: "Technology",
        subCategory: "Data Science",
        description: "Learn data analytics with Google's professional certificate program",
        objectives: ["Master Google Analytics", "Learn data visualization", "Understand statistical analysis"],
        requirements: ["Basic computer skills", "Internet connection"],
        targetAudience: ["Beginners", "Career changers", "Students"],
        syllabus: [],
        publishedDate: "2024-01-01",
        isNewlyLaunched: true,
        isBestseller: true,
        hasCaption: true,
        hasCertificate: true,
        features: ["Certificate of completion", "Lifetime access", "Mobile friendly"]
      },
      {
        id: 102,
        title: "Advanced Python Programming",
        subtitle: "Take your Python skills to the next level",
        authorId: 3,
        provider: {
          name: "LinkedIn",
          logoUrl: "https://i.imgur.com/linkedin-logo.png"
        },
        thumbnailUrl: "https://i.imgur.com/python-thumb.png",
        rating: 4.6,
        reviewsCount: 890,
        studentsCount: 15000,
        duration: "4 months",
        lastUpdated: "2024-02-01",
        difficulty: "Advanced",
        price: 79,
        originalPrice: 149,
        discount: 47,
        languages: ["English"],
        subtitles: ["English"],
        skills: ["Python", "Object-Oriented Programming", "Web Development"],
        category: "Technology",
        subCategory: "Programming",
        description: "Advanced Python programming concepts and applications",
        objectives: ["Master advanced Python", "Build complex applications", "Understand design patterns"],
        requirements: ["Basic Python knowledge", "Programming experience"],
        targetAudience: ["Intermediate programmers", "Python developers", "Software engineers"],
        syllabus: [],
        publishedDate: "2023-12-15",
        isNewlyLaunched: false,
        isBestseller: false,
        hasCaption: true,
        hasCertificate: true,
        features: ["Certificate of completion", "Hands-on projects", "Code reviews"]
      }
    ];
  }

  private getMockEnrollments(): UserEnrollments[] {
    return [
      {
        userId: 1,
        enrollments: [
          {
            id: 1,
            userId: 1,
            courseId: 101,
            enrollmentDate: "2024-01-15",
            progress: 75,
            status: "in_progress",
            completedLessons: [1, 2, 3],
            lastAccessDate: "2024-02-01",
            certificateIssued: false
          }
        ]
      }
    ];
  }

  getAllCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  getCourseById(id: number): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return of(course);
  }

  searchCourses(query: string): Observable<Course[]> {
    const filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      course.skills.some((skill: string) => skill.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filteredCourses);
  }

  filterCourses(filters: {
    difficulty?: string;
    provider?: string;
    rating?: number;
    priceRange?: { min: number; max: number };
  }): Observable<Course[]> {
    let filtered = [...this.courses];

    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }

    if (filters.provider) {
      filtered = filtered.filter(course => course.provider.name === filters.provider);
    }

    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(course => course.rating >= filters.rating!);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(course => 
        course.price >= filters.priceRange!.min && 
        course.price <= filters.priceRange!.max
      );
    }

    return of(filtered);
  }

  getLastViewedCourses(userId: number): Observable<Course[]> {
    const userEnrollments = this.enrollments.find(e => e.userId === userId);
    if (!userEnrollments) {
      return of([]);
    }

    const enrolledCourses = userEnrollments.enrollments.map((enrollment: Enrollment) =>
      this.courses.find(course => course.id === enrollment.courseId)
    ).filter((course: Course | undefined) => course !== undefined) as Course[];

    // Sort by last access date and return the most recent ones
    const sortedCourses = enrolledCourses
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 4);

    return of(sortedCourses);
  }

  getNewlyLaunchedCourses(): Observable<Course[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCourses = this.courses.filter(course =>
      new Date(course.publishedDate) >= thirtyDaysAgo
    ).slice(0, 6);

    return of(newCourses);
  }

  enrollInCourse(userId: number, courseId: number): Observable<boolean> {
    // Simulate enrollment
    console.log(`Enrolling user ${userId} in course ${courseId}`);
    return of(true);
  }

  getBestsellerCourses(): Observable<Course[]> {
    return of(this.courses.filter(course => course.isBestseller));
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return of(this.courses.filter(course => course.category === category));
  }
}