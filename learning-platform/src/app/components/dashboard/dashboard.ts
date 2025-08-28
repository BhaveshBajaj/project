import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/user';
import { BlogService } from '../../services/blog';
import { CourseCardComponent } from '../shared/course-card/course-card';
import { CourseModalComponent } from '../shared/course-modal/course-modal';
import { BlogModalComponent } from '../shared/blog-modal/blog-modal';
import { SidebarFiltersComponent, FilterState } from '../shared/sidebar-filters/sidebar-filters';

import { Course } from '../../models/course';
import { User } from '../../models/user';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, CourseModalComponent, BlogModalComponent, SidebarFiltersComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userStats = {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    certificates: 0,
    totalGoals: 5,
    enrolledCourses: 0
  };
  
  lastViewedCourses: Course[] = [];
  newlyLaunchedCourses: Course[] = [];
  
  // Search functionality
  searchQuery = '';
  showSearchSuggestions = false;
  isSearchMode = false;
  isSearching = false;
  searchResults: Course[] = [];
  searchSuggestions: string[] = [];
  blogs: Blog[] = [];

  // Notification management
  showNotifications = false;
  unreadNotificationsCount = 0;
  
  notifications = [
    {
      id: 1,
      title: 'New Enrolled Course "GCP Cloud Notification"',
      description: 'You have a new course to complete.',
      time: '2 hours ago',
      isRead: false,
      isPromotional: false
    },
    {
      id: 2,
      title: 'Upcoming Live Session',
      description: 'Live session for "UX case studies" from GCPM Today.',
      time: '1 day ago',
      isRead: false,
      isPromotional: false
    },
    {
      id: 3,
      title: 'About "Data" Not in a "MSAP"',
      description: 'The new "Data Science" is waiting for you. Start your new skill of "Machine Learning".',
      time: '2 days ago',
      isRead: true,
      isPromotional: true
    },
    {
      id: 4,
      title: 'New Course Added',
      description: 'Just launched "Complete Web Design Course". Enroll Now!',
      time: '3 days ago',
      isRead: false,
      isPromotional: false
    },
    {
      id: 5,
      title: 'Certificate Available',
      description: 'Your certificate for "Google Data Analytics" is ready for download.',
      time: '5 days ago',
      isRead: true,
      isPromotional: false
    }
  ];

  // Modal state
  modalState = {
    isOpen: false,
    title: '',
    courses: [] as Course[]
  };

  // Blog modal state
  blogModalState = {
    isOpen: false,
    title: '',
    blogs: [] as Blog[]
  };

  // Filter state
  currentFilters: FilterState = {
    courseType: 'all',
    publishedDate: 'anytime',
    rating: [],
    categories: [],
    level: []
  };

  filteredCourses: Course[] = [];
  allCourses: Course[] = [];

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private userService: UserService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.loadUserData(user.id);
      }
    });

    // Initialize notification count
    this.updateUnreadNotificationsCount();

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

    // Load blogs
    this.blogService.getAllBlogs().subscribe((blogs: Blog[]) => {
      this.blogs = blogs;
    });

    // Load all courses for filtering
    this.courseService.getAllCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
      this.filteredCourses = courses;
      
      // Use the same courses for Last Viewed and Newly Launched sections
      this.lastViewedCourses = courses;
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
      // Get all courses from the service for suggestions
      this.courseService.getAllCourses().subscribe((allCourses: Course[]) => {
        const suggestions = new Set<string>();
        
        allCourses.forEach(course => {
          // Add course titles
          if (course.title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
            suggestions.add(course.title);
          }
          // Add skills
          course.skills.forEach(skill => {
            if (skill.toLowerCase().includes(this.searchQuery.toLowerCase())) {
              suggestions.add(skill);
            }
          });
        });
        
        this.searchSuggestions = Array.from(suggestions).slice(0, 8);
      });
    } else {
      this.clearSearch();
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.showSearchSuggestions = false;
      this.isSearchMode = true;
      
      // Initialize search results as empty array to show filters immediately
      this.searchResults = [];
      this.originalSearchResults = [];
      this.isSearching = true;
      
      // Search through all courses in data.json
      this.courseService.searchCourses(this.searchQuery).subscribe((courses: Course[]) => {
        this.originalSearchResults = courses; // Store original results
        this.searchResults = courses;
        this.isSearching = false;
      });
    } else {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.isSearchMode = false;
    this.isSearching = false;
    this.searchResults = [];
    this.originalSearchResults = [];
    this.searchQuery = '';
    this.showSearchSuggestions = false;
  }

  onCourseClick(course: Course): void {
    this.router.navigate(['/course', course.id]);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSearchSuggestions = false;
    this.performSearch();
  }

  // Store original search results to avoid losing data when filters change
  originalSearchResults: Course[] = [];

  onSearchResultsFiltersChanged(filters: FilterState): void {
    // Apply filters to search results
    this.currentFilters = filters;
    this.applyFiltersToSearchResults();
  }

  private applyFiltersToSearchResults(): void {
    if (!this.isSearchMode || this.originalSearchResults.length === 0) return;

    // Start with original search results, not already filtered ones
    let filtered = [...this.originalSearchResults];

    // Apply rating filter
    if (this.currentFilters['rating'] && (this.currentFilters['rating'] as string[]).length > 0) {
      const ratings = this.currentFilters['rating'] as string[];
      filtered = filtered.filter(course => {
        return ratings.some(rating => {
          const minRating = parseFloat(rating);
          return course.rating >= minRating;
        });
      });
    }

    // Apply category filter (match against skills)
    if (this.currentFilters['categories'] && (this.currentFilters['categories'] as string[]).length > 0) {
      const categories = this.currentFilters['categories'] as string[];
      filtered = filtered.filter(course => {
        return categories.some(category => {
          const categoryLabel = category.replace('-', ' ').toLowerCase();
          return course.skills.some(skill => 
            skill.toLowerCase().includes(categoryLabel) || 
            categoryLabel.includes(skill.toLowerCase())
          );
        });
      });
    }

    // Apply level filter (match against difficulty)
    if (this.currentFilters['level'] && (this.currentFilters['level'] as string[]).length > 0) {
      const levels = this.currentFilters['level'] as string[];
      filtered = filtered.filter(course => {
        return levels.some(level => 
          course.difficulty.toLowerCase().includes(level.toLowerCase())
        );
      });
    }

    // Apply course type filter
    if (this.currentFilters['courseType'] && this.currentFilters['courseType'] !== 'all') {
      // This would need to be implemented based on user enrollment data
      console.log('Course type filter:', this.currentFilters['courseType']);
    }

    // Apply published date filter
    if (this.currentFilters['publishedDate'] && this.currentFilters['publishedDate'] !== 'anytime') {
      const now = new Date();
      const filterDate = this.currentFilters['publishedDate'] as string;
      
      filtered = filtered.filter(course => {
        const publishedDate = new Date(course.publishedDate);
        const diffTime = now.getTime() - publishedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterDate) {
          case 'last-week':
            return diffDays <= 7;
          case 'last-month':
            return diffDays <= 30;
          case 'last-year':
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    // Update displayed results
    this.searchResults = filtered;
  }



  // Modal methods
  openViewAllModal(type: string): void {
    switch (type) {
      case 'lastViewed':
        this.modalState = {
          isOpen: true,
          title: 'Last Viewed Courses',
          courses: this.filteredCourses
        };
        break;
      case 'newlyLaunched':
        this.modalState = {
          isOpen: true,
          title: 'Newly Launched Courses',
          courses: this.filteredCourses
        };
        break;
      case 'blogs':
        // Open blog modal instead of course modal
        this.blogModalState = {
          isOpen: true,
          title: 'All Blogs',
          blogs: this.blogs
        };
        return;
      case 'filtered':
        this.modalState = {
          isOpen: true,
          title: 'All Courses',
          courses: this.filteredCourses
        };
        break;
      default:
        console.log('Unknown type:', type);
    }
  }

  closeModal(): void {
    this.modalState.isOpen = false;
  }

  closeBlogModal(): void {
    this.blogModalState.isOpen = false;
  }

  onCourseSelected(course: Course): void {
    this.closeModal();
    this.router.navigate(['/course', course.id]);
  }

  onBlogClick(blog: Blog): void {
    // Navigate to blog detail page
    this.router.navigate(['/blog', blog.id]);
  }

  onBlogSelected(blog: Blog): void {
    this.closeBlogModal();
    this.onBlogClick(blog);
  }

  // Filter methods
  onFiltersChanged(filters: FilterState): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.allCourses];

    // Apply rating filter
    if (this.currentFilters['rating'] && (this.currentFilters['rating'] as string[]).length > 0) {
      const ratings = this.currentFilters['rating'] as string[];
      filtered = filtered.filter(course => {
        return ratings.some(rating => {
          const minRating = parseFloat(rating);
          return course.rating >= minRating;
        });
      });
    }

    // Apply category filter
    if (this.currentFilters['categories'] && (this.currentFilters['categories'] as string[]).length > 0) {
      const categories = this.currentFilters['categories'] as string[];
      filtered = filtered.filter(course => {
        return categories.some(category => {
          return course.skills.some(skill => 
            skill.toLowerCase().includes(category.replace('-', ' '))
          );
        });
      });
    }

    // Apply level filter
    if (this.currentFilters['level'] && (this.currentFilters['level'] as string[]).length > 0) {
      const levels = this.currentFilters['level'] as string[];
      filtered = filtered.filter(course => {
        return levels.some(level => 
          course.difficulty.toLowerCase().includes(level.toLowerCase())
        );
      });
    }

    // Apply course type filter
    if (this.currentFilters['courseType'] && this.currentFilters['courseType'] !== 'all') {
      // This would need to be implemented based on user enrollment data
      console.log('Course type filter:', this.currentFilters['courseType']);
    }

    // Apply published date filter
    if (this.currentFilters['publishedDate'] && this.currentFilters['publishedDate'] !== 'anytime') {
      const now = new Date();
      const filterDate = this.currentFilters['publishedDate'] as string;
      
      filtered = filtered.filter(course => {
        const publishedDate = new Date(course.publishedDate);
        const diffTime = now.getTime() - publishedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterDate) {
          case 'last-week':
            return diffDays <= 7;
          case 'last-month':
            return diffDays <= 30;
          case 'last-year':
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    this.filteredCourses = filtered;
  }

  navigateToMyProfile(): void {
    if (this.currentUser) {
      if (this.currentUser.role === 'Admin') {
        this.router.navigate(['/admin-profile']);
      } else {
        this.router.navigate(['/author', this.currentUser.id]);
      }
    }
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.notification-container');
    
    if (!notificationContainer && this.showNotifications) {
      this.showNotifications = false;
    }
    
    // Also hide search suggestions
    if (!target.closest('.search-container')) {
      this.showSearchSuggestions = false;
    }
  }

  markNotificationAsRead(notification: any): void {
    if (!notification.isRead) {
      notification.isRead = true;
      this.updateUnreadNotificationsCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.updateUnreadNotificationsCount();
  }

  viewAllNotifications(): void {
    this.showNotifications = false;
    // Navigate to notifications page or show all notifications modal
    console.log('Navigate to all notifications');
  }

  private updateUnreadNotificationsCount(): void {
    this.unreadNotificationsCount = this.notifications.filter(n => !n.isRead).length;
  }
}
