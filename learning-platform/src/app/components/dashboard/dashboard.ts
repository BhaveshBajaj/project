import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/user';
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
  blogs: Blog[] = [
    {
      id: 1,
      title: 'Mastering Google Data Analytics: A Complete Guide',
      excerpt: 'Discover the power of Google Analytics and learn how to transform raw data into actionable insights for your business.',
      imageUrl: 'https://i.imgur.com/3q6CqYq.png',
      author: 'John Doe',
      authorId: 2,
      readTime: '5 min read',
      publishedDate: '2024-01-15',
      category: 'Analytics',
      tags: ['Google Analytics', 'Data Analysis', 'Web Analytics'],
      views: 1247,
      likes: 89
    },
    {
      id: 2,
      title: 'Cybersecurity Best Practices for 2024',
      excerpt: 'Stay ahead of cyber threats with these essential security practices and tools every developer should know.',
      imageUrl: 'https://i.imgur.com/Y8L4En5.png',
      author: 'Jane Smith',
      authorId: 3,
      readTime: '7 min read',
      publishedDate: '2024-01-10',
      category: 'Security',
      tags: ['Cybersecurity', 'Data Protection', 'Best Practices'],
      views: 892,
      likes: 67
    },
    {
      id: 3,
      title: 'From Data to Insights: A Data Analyst Journey',
      excerpt: 'Follow the journey of a data analyst and learn the essential skills needed to succeed in this growing field.',
      imageUrl: 'https://i.imgur.com/nNn1y4J.png',
      author: 'Mike Johnson',
      authorId: 2,
      readTime: '4 min read',
      publishedDate: '2024-01-05',
      category: 'Career',
      tags: ['Data Analysis', 'Career Guide', 'Skills Development'],
      views: 675,
      likes: 45
    },
    {
      id: 4,
      title: 'Machine Learning Trends and Future Outlook',
      excerpt: 'Explore the latest trends in machine learning and discover what the future holds for AI technologies.',
      imageUrl: 'https://i.imgur.com/gK9fI5P.png',
      author: 'Sarah Wilson',
      authorId: 5,
      readTime: '6 min read',
      publishedDate: '2024-01-01',
      category: 'Technology',
      tags: ['Machine Learning', 'AI', 'Technology Trends'],
      views: 1534,
      likes: 112
    },
    {
      id: 5,
      title: 'Building Scalable Web Applications',
      excerpt: 'Learn the principles and best practices for building web applications that can scale with your business.',
      imageUrl: 'https://i.imgur.com/web-dev.png',
      author: 'David Chen',
      authorId: 4,
      readTime: '8 min read',
      publishedDate: '2023-12-28',
      category: 'Development',
      tags: ['Web Development', 'Scalability', 'Architecture'],
      views: 943,
      likes: 78
    },
    {
      id: 6,
      title: 'Cloud Computing: AWS vs Azure vs GCP',
      excerpt: 'A comprehensive comparison of the three major cloud platforms to help you choose the right one.',
      imageUrl: 'https://i.imgur.com/cloud-comp.png',
      author: 'Stephane Maarek',
      authorId: 2,
      readTime: '10 min read',
      publishedDate: '2023-12-25',
      category: 'Cloud',
      tags: ['Cloud Computing', 'AWS', 'Azure', 'GCP'],
      views: 2156,
      likes: 187
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

    // Load all courses for filtering
    this.courseService.getAllCourses().subscribe((courses: Course[]) => {
      this.allCourses = courses;
      this.filteredCourses = courses;
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

  // Modal methods
  openViewAllModal(type: string): void {
    switch (type) {
      case 'lastViewed':
        this.modalState = {
          isOpen: true,
          title: 'Last Viewed Courses',
          courses: this.lastViewedCourses
        };
        break;
      case 'newlyLaunched':
        this.modalState = {
          isOpen: true,
          title: 'Newly Launched Courses',
          courses: this.newlyLaunchedCourses
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
      this.router.navigate(['/author', this.currentUser.id]);
    }
  }
}
