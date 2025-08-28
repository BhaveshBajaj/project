import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user';

export interface UserEnrollment {
  courseId: number;
  progressPercent: number;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  authorId: number;
  provider: {
    name: string;
    logoUrl: string;
  };
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  difficulty: string;
  durationText: string;
  price: number;
  originalPrice?: number;
  skills: string[];
  whatYoullLearn: string[];
  requirements: string[];
  status: string;
  publishedDate: string;
}

export interface DataResponse {
  users: User[];
  courses: Course[];
  userEnrollments: { [key: string]: UserEnrollment[] };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dataUrl = '/data.json'; // Updated to use root path since public folder is served at root
  private cachedData: DataResponse | null = null;

  constructor(private http: HttpClient) {}

  private getData(): Observable<DataResponse> {
    if (this.cachedData) {
      console.log('Using cached data, no API call made');
      return of(this.cachedData);
    }
    
    console.log('Making API call to:', this.dataUrl);
    return this.http.get<DataResponse>(this.dataUrl).pipe(
      map(data => {
        console.log('API call successful, data received:', data);
        this.cachedData = data;
        return data;
      }),
      catchError(error => {
        console.error('Error fetching data from', this.dataUrl, error);
        console.log('Using mock data as fallback');
        return of(this.getMockData());
      })
    );
  }

  // Method to clear cache and force fresh data
  clearCache(): void {
    console.log('Clearing cache, next request will make API call');
    this.cachedData = null;
  }

  // Fallback method with mock data
  private getMockData(): DataResponse {
    return {
      users: [
        {
          id: 1,
          username: "hshimron",
          email: "harry.shimron@example.com",
          password: "hashed_password",
          fullName: "Harry Shimron",
          track: "DC Software Engineer II",
          avatarUrl: "https://i.pravatar.cc/150?u=hshimron",
          joinDate: "2021-08-14T00:00:00.000Z",
          role: "Admin",
          bio: "Passionate writer and avid traveler, Harry shares insights from his adventures around the globe. With a background in journalism, he combines storytelling with a love for photography, capturing the essence of each destination.",
          location: "Bangalore, India"
        },
        {
          id: 2,
          username: "smaarek",
          email: "stephane.maarek@example.com",
          password: "hashed_password",
          fullName: "Stephane Maarek",
          track: "AWS Certified Cloud Practitioner",
          avatarUrl: "https://i.pravatar.cc/150?u=smaarek",
          joinDate: "2020-05-20T00:00:00.000Z",
          role: "Author",
          bio: "He is a solutions architect, consultant and software developer that has a particular interest in all things related to Cloud and Big Data. He's also a many-times best seller instructor on Udemy for his courses in AWS and Apache Kafka.",
          location: "New York, USA"
        },
        {
          id: 3,
          username: "wwarren",
          email: "wade.warren@example.com",
          password: "hashed_password",
          fullName: "Wade Warren",
          track: "Learning for U.S",
          avatarUrl: "https://i.pravatar.cc/150?u=wwarren",
          joinDate: "2022-01-10T00:00:00.000Z",
          role: "Learner",
          bio: null,
          location: "USA"
        },
        {
          id: 4,
          username: "jjones",
          email: "jacob.jones@example.com",
          password: "hashed_password",
          fullName: "Jacob Jones",
          track: "Learning for India",
          avatarUrl: "https://i.pravatar.cc/150?u=jjones",
          joinDate: "2022-03-15T00:00:00.000Z",
          role: "Learner",
          bio: null,
          location: "India"
        },
        {
          id: 5,
          username: "asinghla",
          email: "alisha.singhla@example.com",
          password: "hashed_password",
          fullName: "Alisha Singhla",
          track: null,
          avatarUrl: "https://i.pravatar.cc/150?u=asinghla",
          joinDate: "2022-06-15T00:00:00.000Z",
          role: "Author",
          bio: null,
          location: null
        },
        {
          id: 6,
          username: "ddeb",
          email: "dipaman.deb@example.com",
          password: "hashed_password",
          fullName: "Dipaman Deb",
          track: null,
          avatarUrl: "https://i.pravatar.cc/150?u=ddeb",
          joinDate: "2022-06-15T00:00:00.000Z",
          role: "Learner",
          bio: null,
          location: null
        }
      ],
      courses: [
        {
          id: 101,
          title: "Google Data Analytics Course-1",
          subtitle: "Become a Prompt Engineering Expert. Master prompt engineering patterns, techniques, and approaches to effectively leverage Generative AI",
          authorId: 2,
          provider: {
            name: "Google",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
          },
          thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format",
          rating: 4.8,
          reviewCount: 1278,
          enrollmentCount: 45908,
          difficulty: "Beginner",
          durationText: "05 Weeks",
          price: 49.99,
          originalPrice: 79.99,
          skills: ["Prompt Engineering", "MS Excel", "Data Ethics", "Document Management", "Data Analysis"],
          whatYoullLearn: [],
          requirements: [],
          status: "Published",
          publishedDate: "2023-05-20T00:00:00.000Z"
        },
        {
          id: 102,
          title: "Python for Data Science, AI & Development",
          subtitle: "Master Python for data science and AI applications.",
          authorId: 2,
          provider: {
            name: "LinkedIn",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg"
          },
          thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&auto=format",
          rating: 4.5,
          reviewCount: 133000,
          enrollmentCount: 635,
          difficulty: "Beginner",
          durationText: "6 months",
          price: 0,
          skills: ["Spreadsheet", "Data Analysis", "SQL", "Data Visualization", "Data C..."],
          whatYoullLearn: [],
          requirements: [],
          status: "Published",
          publishedDate: "2023-09-01T00:00:00.000Z"
        },
        {
          id: 103,
          title: "Big Data Visualization",
          subtitle: "Learn to visualize and present complex data sets effectively.",
          authorId: 5,
          provider: {
            name: "LinkedIn",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg"
          },
          thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format",
          rating: 4.3,
          reviewCount: 133000,
          enrollmentCount: 635,
          difficulty: "Intermediate",
          durationText: "6 months",
          price: 89.99,
          originalPrice: 149.99,
          skills: ["Tableau", "PowerBI", "D3.js", "Data Storytelling"],
          whatYoullLearn: [],
          requirements: [],
          status: "Published",
          publishedDate: "2023-11-15T00:00:00.000Z"
        }
      ],
      userEnrollments: {
        "1": [
          { courseId: 101, progressPercent: 21 },
          { courseId: 103, progressPercent: 10 },
          { courseId: 104, progressPercent: 80 }
        ],
        "3": [
          { courseId: 101, progressPercent: 100 },
          { courseId: 102, progressPercent: 50 }
        ],
        "4": [
          { courseId: 101, progressPercent: 100 }
        ]
      }
    };
  }

  getAllUsers(): Observable<User[]> {
    return this.getData().pipe(
      map(data => data.users)
    );
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.getAllUsers().pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  getUserStats(userId: number): Observable<any> {
    return this.getData().pipe(
      map(data => {
        const user = data.users.find(u => u.id === userId);
        const enrollments = data.userEnrollments[userId] || [];
        
        const totalCourses = enrollments.length;
        const completedCourses = enrollments.filter(e => e.progressPercent === 100).length;
        const inProgressCourses = enrollments.filter(e => e.progressPercent > 0 && e.progressPercent < 100).length;
        
        // Calculate total hours (assuming 1 hour per 10% progress)
        const totalHours = enrollments.reduce((sum, e) => sum + (e.progressPercent / 10), 0);
        
        return {
          totalCourses,
          completedCourses,
          inProgressCourses,
          totalHours: Math.round(totalHours * 10) / 10,
          certificates: completedCourses,
          totalGoals: 5,
          enrolledCourses: totalCourses
        };
      })
    );
  }

  // Enhanced user data for user management
  getEnhancedUsers(): Observable<any[]> {
    return this.getData().pipe(
      map(data => {
        return data.users.map(user => {
          const enrollments = data.userEnrollments[user.id] || [];
          const userCourses = data.courses.filter(course => 
            enrollments.some(e => e.courseId === course.id)
          );

          // Calculate learning statistics
          const learningHours = this.calculateLearningHours(enrollments);
          const pendingCourses = enrollments.filter(e => e.progressPercent === 0).length;
          const ratedCourses = enrollments.filter(e => e.progressPercent > 0).length;

          // Create learning history
          const learningHistory = enrollments.map(enrollment => {
            const course = data.courses.find(c => c.id === enrollment.courseId);
            return {
              course: course?.title || 'Unknown Course',
              completion: enrollment.progressPercent,
              status: this.getCompletionStatus(enrollment.progressPercent)
            };
          });

          // Parse name components
          const nameParts = user.fullName.split(' ');
          const firstName = nameParts[0] || '';
          const middleName = nameParts.slice(1).join(' ') || '';

          // Format join date
          const joinDate = new Date(user.joinDate);
          const sinceDate = joinDate.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });

          const enhancedUser = {
            ...user,
            firstName,
            middleName,
            joinedDate: joinDate.toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: 'numeric' 
            }),
            sinceDate,
            learningHours: `${learningHours} hrs/week`,
            pendingCourses,
            ratedCourses,
            learningHistory
          };
          
          return enhancedUser;
        });
      })
    );
  }

  private calculateLearningHours(enrollments: UserEnrollment[]): number {
    // Calculate average hours per week based on progress
    const totalProgress = enrollments.reduce((sum, e) => sum + e.progressPercent, 0);
    const avgProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0;
    
    // Assume 1 hour per 20% progress on average
    return Math.round((avgProgress / 20) * 10) / 10;
  }

  private getCompletionStatus(progress: number): string {
    if (progress === 100) return 'complete';
    if (progress >= 60) return 'in-progress';
    return 'started';
  }

  updateUser(userId: number, updates: Partial<User>): Observable<User> {
    return this.getData().pipe(
      map(data => {
        const userIndex = data.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        data.users[userIndex] = { ...data.users[userIndex], ...updates };
        this.cachedData = data;
        
        return data.users[userIndex];
      })
    );
  }

  searchUsers(query: string): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
}