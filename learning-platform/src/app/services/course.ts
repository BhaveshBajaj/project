import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Course, Curriculum, Quiz, CourseReviews, Banner } from '../models/course';
import { Enrollment, UserEnrollments } from '../models/enrollment';
import { AppData } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private enrollments: UserEnrollments[] = [];
  private curriculum: Curriculum = {};
  private quizzes: Quiz = {};
  private reviews: CourseReviews = {};
  private banners: Banner[] = [];
  private dataLoaded = false;
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load from data.json with cache busting
      const timestamp = new Date().getTime();
      this.http.get<AppData>(`data.json?v=${timestamp}`).subscribe({
        next: (data) => {
          console.log('🔄 Raw data received from data.json:', data);
          
          this.courses = data.courses || [];
          this.curriculum = data.curriculum || {};
          this.quizzes = data.quizzes || {};
          this.reviews = data.reviews || {};
          this.banners = data.banners || [];
          
          // Transform user enrollments to match existing structure
          this.enrollments = this.transformEnrollments(data.userEnrollments || {});
          
          console.log('✅ Loaded data from data.json:');
          console.log('- Courses:', this.courses.length);
          console.log('- Curriculum sections:', Object.keys(this.curriculum).length);
          console.log('- Quiz sections:', Object.keys(this.quizzes).length);
          console.log('- Quizzes raw data:', data.quizzes);
          console.log('- Reviews:', Object.keys(this.reviews).length);
          console.log('- Banners:', this.banners.length);
          
          // Verify quiz data is properly loaded
          if (data.quizzes) {
            console.log('🎯 Quiz data verification:');
            Object.keys(data.quizzes).forEach(courseId => {
              console.log(`  - Course ${courseId}: ${data.quizzes[courseId].length} questions`);
            });
          }
          
          this.coursesSubject.next(this.courses);
          this.dataLoaded = true;
        },
        error: (error) => {
          console.error('❌ Failed to load data from data.json:', error);
          // Fallback to mock data
          this.courses = this.getMockCourses();
          this.enrollments = this.getMockEnrollments();
          this.coursesSubject.next(this.courses);
          this.dataLoaded = true;
        }
      });
    } catch (error) {
      console.error('❌ Error loading course data:', error);
      this.courses = this.getMockCourses();
      this.enrollments = this.getMockEnrollments();
      this.coursesSubject.next(this.courses);
      this.dataLoaded = true;
    }
  }

  private transformEnrollments(userEnrollments: { [userId: string]: { courseId: number; progressPercent: number }[] }): UserEnrollments[] {
    const result: UserEnrollments[] = [];
    
    Object.entries(userEnrollments).forEach(([userId, enrollments]) => {
      const userEnrollmentData: UserEnrollments = {
        userId: parseInt(userId),
        enrollments: enrollments.map((enrollment, index) => ({
          id: parseInt(userId) * 1000 + index,
          userId: parseInt(userId),
          courseId: enrollment.courseId,
          enrollmentDate: new Date().toISOString().split('T')[0],
          progress: enrollment.progressPercent,
          status: enrollment.progressPercent === 100 ? 'completed' : enrollment.progressPercent > 0 ? 'in_progress' : 'enrolled',
          completedLessons: [],
          lastAccessDate: new Date().toISOString().split('T')[0],
          certificateIssued: enrollment.progressPercent === 100
        }))
      };
      result.push(userEnrollmentData);
    });
    
    return result;
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
      },
      {
        id: 103,
        title: "AWS Cloud Computing Fundamentals",
        subtitle: "Master cloud computing with Amazon Web Services",
        authorId: 2,
        provider: {
          name: "Amazon",
          logoUrl: "https://i.imgur.com/aws-logo.png"
        },
        thumbnailUrl: "https://i.imgur.com/aws-thumb.png",
        rating: 4.9,
        reviewsCount: 2100,
        studentsCount: 32000,
        duration: "8 weeks",
        lastUpdated: "2024-01-20",
        difficulty: "Beginner",
        price: 89,
        originalPrice: 159,
        discount: 44,
        languages: ["English"],
        subtitles: ["English", "Spanish", "French"],
        skills: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
        category: "Technology",
        subCategory: "Cloud Computing",
        description: "Comprehensive introduction to AWS cloud services",
        objectives: ["Understand AWS core services", "Deploy applications on AWS", "Manage cloud infrastructure"],
        requirements: ["Basic IT knowledge", "Computer with internet access"],
        targetAudience: ["IT professionals", "Developers", "System administrators"],
        syllabus: [],
        publishedDate: "2023-11-20",
        isNewlyLaunched: false,
        isBestseller: true,
        hasCaption: true,
        hasCertificate: true,
        features: ["AWS hands-on labs", "Real-world projects", "Industry certification prep"]
      },
      {
        id: 104,
        title: "Data Analytics with Apache Kafka",
        subtitle: "Real-time data streaming and analytics",
        authorId: 2,
        provider: {
          name: "Apache",
          logoUrl: "https://i.imgur.com/kafka-logo.png"
        },
        thumbnailUrl: "https://i.imgur.com/kafka-thumb.png",
        rating: 4.7,
        reviewsCount: 756,
        studentsCount: 8900,
        duration: "6 weeks",
        lastUpdated: "2024-02-10",
        difficulty: "Advanced",
        price: 119,
        originalPrice: 199,
        discount: 40,
        languages: ["English"],
        subtitles: ["English"],
        skills: ["Apache Kafka", "Data Streaming", "Big Data", "Real-time Analytics"],
        category: "Technology",
        subCategory: "Data Engineering",
        description: "Master real-time data processing with Apache Kafka",
        objectives: ["Set up Kafka clusters", "Build streaming applications", "Handle high-volume data"],
        requirements: ["Java programming knowledge", "Understanding of distributed systems"],
        targetAudience: ["Data engineers", "Backend developers", "DevOps engineers"],
        syllabus: [],
        publishedDate: "2023-10-15",
        isNewlyLaunched: false,
        isBestseller: false,
        hasCaption: true,
        hasCertificate: true,
        features: ["Live streaming demos", "Production-ready examples", "Performance optimization"]
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
    if (this.dataLoaded) {
      return of(this.courses);
    } else {
      return this.courses$;
    }
  }

  getCourseById(id: number): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return of(course);
  }

  searchCourses(query: string): Observable<Course[]> {
    // If data is not loaded yet, wait for it
    if (!this.dataLoaded || this.courses.length === 0) {
      return this.courses$.pipe(
        map(courses => {
          return courses.filter(course =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            course.skills.some((skill: string) => skill.toLowerCase().includes(query.toLowerCase()))
          );
        })
      );
    }
    
    // Data is already loaded, search directly
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
        course.price !== undefined && course.price !== null &&
        course.price >= filters.priceRange!.min && 
        course.price <= filters.priceRange!.max
      );
    }

    return of(filtered);
  }

  getLastViewedCourses(userId: number): Observable<Course[]> {
    // Get user's enrolled courses and return the most recently accessed ones
    const userEnrollment = this.enrollments.find(e => e.userId === userId);
    if (userEnrollment && userEnrollment.enrollments.length > 0) {
      const enrolledCourseIds = userEnrollment.enrollments.map(e => e.courseId);
      const enrolledCourses = this.courses.filter(course => enrolledCourseIds.includes(course.id));
      return of(enrolledCourses.slice(0, 4));
    }
    // Fallback to first 4 courses
    return of(this.courses.slice(0, 4));
  }

  getNewlyLaunchedCourses(): Observable<Course[]> {
    // Sort by publishedDate and return the most recent courses
    const sortedCourses = [...this.courses].sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
    return of(sortedCourses.slice(0, 4));
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

  getCoursesByAuthor(authorId: number): Observable<Course[]> {
    return of(this.courses.filter(course => course.authorId === authorId));
  }

  createCourse(courseData: any): Observable<Course> {
    const newCourseId = this.getNextCourseId();
    
    // Create a new course with the next available ID
    const newCourse: Course = {
      ...courseData,
      id: newCourseId,
      isNewlyLaunched: true,
      isBestseller: false,
      hasCaption: false,
      hasCertificate: true,
      provider: {
        name: courseData.authorName || "Custom Provider",
        logoUrl: courseData.authorAvatar || ""
      },
      category: courseData.category || "General",
      subCategory: "Custom",
      objectives: courseData.whatYouWillLearn ? [courseData.whatYouWillLearn] : [],
      requirements: courseData.requirements ? [courseData.requirements] : [],
      targetAudience: ["Students", "Professionals"],
      syllabus: courseData.modules || [],
      features: ["Certificate of completion", "Lifetime access", "Mobile access"],
      reviewCount: 0,
      enrollmentCount: 0,
      durationText: courseData.duration
    };

    // Add to courses array
    this.courses.push(newCourse);
    
    // Handle quiz data - convert to the data.json format
    if (courseData.quizQuestions && courseData.quizQuestions.length > 0) {
      const formattedQuizzes = courseData.quizQuestions.map((question: any, index: number) => ({
        id: parseInt(newCourseId.toString() + (index + 1).toString().padStart(3, '0')),
        questionText: question.questionText,
        options: question.options.map((option: any) => ({
          text: option.text,
          isCorrect: option.isCorrect
        }))
      }));
      
      // Store quiz data
      this.quizzes[newCourseId.toString()] = formattedQuizzes;
    }

    // Handle curriculum data - convert modules to curriculum format
    if (courseData.modules && courseData.modules.length > 0) {
      const formattedCurriculum = courseData.modules.map((module: any, moduleIndex: number) => ({
        id: parseInt(newCourseId.toString() + (moduleIndex + 1).toString().padStart(2, '0')),
        title: module.title,
        lectures: module.lectures.map((lecture: any, lectureIndex: number) => ({
          id: parseInt(newCourseId.toString() + (moduleIndex + 1).toString().padStart(2, '0') + (lectureIndex + 1).toString().padStart(2, '0')),
          title: lecture.title,
          type: lecture.type === 'video' ? 'Video' : lecture.type === 'text' ? 'Text' : 'PDF',
          durationMinutes: 5, // Default duration
          content: {
            htmlContent: lecture.type === 'text' ? lecture.content || lecture.description : undefined,
            videoUrl: lecture.type === 'video' ? lecture.videoUrl : undefined,
            fileUrl: lecture.type === 'pdf' ? lecture.content : undefined
          }
        }))
      }));
      
      // Store curriculum data
      this.curriculum[newCourseId.toString()] = formattedCurriculum;
    }
    
    // Update the data structure for persistence
    this.updateDataStructure();
    
    // Emit updated courses
    this.coursesSubject.next(this.courses);
    
    return of(newCourse);
  }

  private updateDataStructure(): void {
    // Create complete data structure
    const completeData = {
      courses: this.courses,
      curriculum: this.curriculum,
      quizzes: this.quizzes,
      reviews: this.reviews,
      banners: this.banners,
      userEnrollments: {}
    };
    
    // Store in localStorage to persist changes
    localStorage.setItem('appData', JSON.stringify(completeData));
    
    console.log('Course data updated and saved:', {
      coursesCount: this.courses.length,
      curriculumSections: Object.keys(this.curriculum).length,
      quizSections: Object.keys(this.quizzes).length
    });
  }

  private getNextCourseId(): number {
    const maxId = Math.max(...this.courses.map(course => course.id), 0);
    return maxId + 1;
  }

  // New methods for additional data
  
  getCurriculum(courseId: number): Observable<any[]> {
    const courseCurriculum = this.curriculum[courseId.toString()] || [];
    return of(courseCurriculum);
  }

  getQuizzes(courseId: number): Observable<any[]> {
    console.log('🔧 CourseService.getQuizzes called for course:', courseId);
    console.log('📚 Data loaded status:', this.dataLoaded);
    console.log('🗂️ Available quiz keys:', Object.keys(this.quizzes));
    
    if (!this.dataLoaded) {
      console.log('⏳ Data not loaded yet, waiting for courses$ stream...');
      // Wait for data to load
      return this.courses$.pipe(
        map(() => {
          const courseQuizzes = this.quizzes[courseId.toString()] || [];
          console.log('📋 Quiz data after waiting for load:', courseQuizzes);
          return courseQuizzes;
        })
      );
    }
    
    const courseQuizzes = this.quizzes[courseId.toString()] || [];
    console.log('📋 Quiz data for course', courseId, ':', courseQuizzes);
    return of(courseQuizzes);
  }

  getReviews(courseId: number): Observable<any[]> {
    const courseReviews = this.reviews[courseId.toString()] || [];
    return of(courseReviews);
  }

  getBanners(): Observable<Banner[]> {
    const activeBanners = this.banners.filter(banner => banner.status === 'active');
    return of(activeBanners);
  }

  getUserProgress(userId: number, courseId: number): Observable<number> {
    const userEnrollment = this.enrollments.find(e => e.userId === userId);
    if (userEnrollment) {
      const enrollment = userEnrollment.enrollments.find(e => e.courseId === courseId);
      if (enrollment) {
        return of(enrollment.progress);
      }
    }
    return of(0);
  }

  private loadCoursesFromStorage(): Course[] | null {
    try {
      const stored = localStorage.getItem('courses');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading courses from storage:', error);
      return null;
    }
  }
}