import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course';

interface CourseSection {
  id: number;
  title: string;
  duration: string;
  expanded: boolean;
  lessons: CourseLessson[];
}

interface CourseLessson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Testimonial {
  id: number;
  rating: number;
  text: string;
  authorName: string;
  authorTitle: string;
  avatar: string;
}

interface RelatedCourse {
  id: number;
  title: string;
  image: string;
  rating: number;
  students: number;
  instructor: string;
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss'
})
export class CourseDetailsComponent implements OnInit {
  course: Course | undefined;
  isLoading = true;
  error = false;
  searchQuery = '';
  activeTab = 'overview';

  courseSections: CourseSection[] = [
    {
      id: 1,
      title: 'Introduction',
      duration: '11 Lectures • 37 min',
      expanded: false,
      lessons: [
        { id: 1, title: 'Course Overview', duration: '3 min', completed: true },
        { id: 2, title: 'Google Analytics Overview', duration: '5 min', completed: true },
        { id: 3, title: 'How to Set Up a Google Analytics Data Account', duration: '8 min', completed: false },
      ]
    },
    {
      id: 2,
      title: 'Google Analytics Dictionary - The Top 20 Terms to Know',
      duration: '8 Lectures • 24 min',
      expanded: false,
      lessons: [
        { id: 4, title: 'A Guide on Google Analytics 4 Setup', duration: '6 min', completed: false },
        { id: 5, title: 'How To Setup Google Analytics Like A Pro', duration: '8 min', completed: false },
        { id: 6, title: 'How To Analyze Reports & Increase Traffic And Sales', duration: '10 min', completed: false },
      ]
    },
    {
      id: 3,
      title: 'How Google Analytics Tips And Tricks',
      duration: '12 Lectures • 45 min',
      expanded: false,
      lessons: [
        { id: 7, title: 'Advanced Analytics Techniques', duration: '12 min', completed: false },
        { id: 8, title: 'Custom Reports and Dashboards', duration: '15 min', completed: false },
        { id: 9, title: 'E-commerce Tracking', duration: '18 min', completed: false },
      ]
    },
    {
      id: 4,
      title: 'Conclusion',
      duration: '3 Lectures • 12 min',
      expanded: false,
      lessons: [
        { id: 10, title: 'Course Summary', duration: '4 min', completed: false },
        { id: 11, title: 'Next Steps', duration: '4 min', completed: false },
        { id: 12, title: 'Resources and Links', duration: '4 min', completed: false },
      ]
    }
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      rating: 4.8,
      text: 'This Google Data Analytics course was a great resource for my classes. Instructors really went into detail covering all the fundamentals you need to really understand analytics. It really helped me understand how to process and analyze data and really helped set me up to understand advanced analytics concepts.',
      authorName: 'Wade Warren',
      authorTitle: 'Learning for U.S',
      avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      rating: 4.7,
      text: 'I took Web 3.1 because I was looking for a specific feature. This new analytics program was a great choice. Too detailed and very advanced Machine learning concepts. The provided assignments and in the exercises provide clear and sufficient performance.',
      authorName: 'Jacob Jones',
      authorTitle: 'Learning for India',
      avatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 3,
      rating: 4.5,
      text: 'As a marketing professional, I never I needed to become more data-driven. This course really opened doors about the thought data analysis could help shape the conversation.',
      authorName: 'Bessie Cooper',
      authorTitle: 'Learning for U.K',
      avatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 4,
      rating: 4.6,
      text: 'I had a background in finance but wanted to pivot into a more analytical role. This Google Data Analytics certificate gave me the foundation for the key tracking and advanced analytics.',
      authorName: 'Ronald Richards',
      authorTitle: 'Learning for India',
      avatar: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  relatedCourses: RelatedCourse[] = [
    {
      id: 1,
      title: 'Python Beginner Freelance Android + Web Development',
      image: 'https://i.imgur.com/3q6CqYq.png',
      rating: 4.8,
      students: 64503,
      instructor: 'Python for Data Science, AI & Development'
    },
    {
      id: 2,
      title: 'Machine Learning A-Z: Python R in Data Science',
      image: 'https://i.imgur.com/Y8L4En5.png',
      rating: 4.5,
      students: 45820,
      instructor: 'Python for Data Science, AI & Development'
    },
    {
      id: 3,
      title: 'Go Full-Stack Course Complete Web Development Bootcamp',
      image: 'https://i.imgur.com/nNn1y4J.png',
      rating: 4.7,
      students: 32614,
      instructor: 'Python for Data Science, AI & Development'
    },
    {
      id: 4,
      title: 'Docker and DevOps Cloud Sourcing',
      image: 'https://i.imgur.com/gK9fI5P.png',
      rating: 4.6,
      students: 28954,
      instructor: 'Python for Data Science, AI & Development'
    },
    {
      id: 5,
      title: 'React - The Complete Guide 2024 (incl Hooks)',
      image: 'https://i.imgur.com/3q6CqYq.png',
      rating: 4.9,
      students: 89654,
      instructor: 'Modern React Development'
    }
  ];

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
      next: (course: Course | undefined) => {
        this.course = course;
        this.isLoading = false;
        if (!course) {
          this.error = true;
        }
      },
      error: (error: any) => {
        console.error('Error loading course:', error);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSection(sectionId: number): void {
    const section = this.courseSections.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }

  getTotalLessons(): number {
    return this.courseSections.reduce((total, section) => total + section.lessons.length, 0);
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

  navigateHome(): void {
    this.router.navigate(['/dashboard']);
  }
}