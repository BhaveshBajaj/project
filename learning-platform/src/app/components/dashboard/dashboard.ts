import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/user';
import { CourseCardComponent } from '../shared/course-card/course-card';

import { Course } from '../../models/course';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userStats = {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    certificates: 0
  };
  
  lastViewedCourses: Course[] = [];
  newlyLaunchedCourses: Course[] = [];
  
  // Search functionality
  searchQuery = '';
  showSearchSuggestions = false;
  searchSuggestions = [
    'Data Analytics',
    'Machine Learning',
    'Python Programming',
    'Web Development',
    'Digital Marketing',
    'Cybersecurity',
    'Cloud Computing',
    'UI/UX Design'
  ];
  blogs = [
    {
      id: 1,
      title: 'Google Data Analytics',
      imageUrl: 'https://i.imgur.com/3q6CqYq.png',
      author: 'John Doe',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Cybersecurity',
      imageUrl: 'https://i.imgur.com/Y8L4En5.png',
      author: 'Jane Smith',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Data Analyst',
      imageUrl: 'https://i.imgur.com/nNn1y4J.png',
      author: 'Mike Johnson',
      readTime: '4 min read'
    },
    {
      id: 4,
      title: 'Machine Learning',
      imageUrl: 'https://i.imgur.com/gK9fI5P.png',
      author: 'Sarah Wilson',
      readTime: '6 min read'
    }
  ];

  notifications = [
    {
      id: 1,
      title: 'New Enrolled Course "GCP Cloud Notification"',
      description: 'You have a new course to complete.',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Upcoming Live Session',
      description: 'Live session for "UX case studies" from GCPM Today.',
      time: '1 day ago'
    },
    {
      id: 3,
      title: 'About "Data" Not in a "MSAP"',
      description: 'The new "Data Science" is waiting for you. Start your new skill of "Machine Learning".',
      time: '2 days ago',
      isPromotional: true
    },
    {
      id: 4,
      title: 'New Course Added',
      description: 'Just launched "Complete Web Design Course". Enroll Now!',
      time: '3 days ago'
    }
  ];

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.loadUserData(user.id);
      }
    });

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  private loadUserData(userId: number): void {
    // Load user stats
    this.userService.getUserStats(userId).subscribe((stats: any) => {
      this.userStats = stats;
    });

    // Load last viewed courses
    this.courseService.getLastViewedCourses(userId).subscribe((courses: Course[]) => {
      this.lastViewedCourses = courses;
    });

    // Load newly launched courses
    this.courseService.getNewlyLaunchedCourses().subscribe((courses: Course[]) => {
      this.newlyLaunchedCourses = courses;
    });
  }

  onViewAll(type: string): void {
    if (type === 'goals') {
      // Navigate to goals page
      console.log('Navigate to goals page');
    } else if (type === 'courses') {
      // Navigate to enrolled courses page
      console.log('Navigate to enrolled courses page');
    } else if (type === 'certificates') {
      // Navigate to certificates page
      console.log('Navigate to certificates page');
    }
  }

  onDownloadCertificates(): void {
    console.log('Download certificates');
  }

  // Search functionality methods
  onSearchInput(): void {
    this.showSearchSuggestions = this.searchQuery.length > 0;
    if (this.searchQuery.length > 0) {
      // Filter suggestions based on search query
      this.searchSuggestions = [
        'Data Analytics',
        'Machine Learning',
        'Python Programming',
        'Web Development',
        'Digital Marketing',
        'Cybersecurity',
        'Cloud Computing',
        'UI/UX Design'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      this.showSearchSuggestions = false;
      
      // Here you would typically filter the courses or navigate to search results
      this.courseService.searchCourses(this.searchQuery).subscribe((courses: Course[]) => {
        console.log('Search results:', courses);
        // You could update the displayed courses or show search results section
        this.lastViewedCourses = courses.slice(0, 4);
      });
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSearchSuggestions = false;
    this.performSearch();
  }

  // Hide suggestions when clicking outside
  onDocumentClick(): void {
    this.showSearchSuggestions = false;
  }
}
