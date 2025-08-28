import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent implements OnInit {
  currentUser: User | null = null;
  activeTab = 'user-management';
  userSearchQuery = '';
  showEditModal = false;
  selectedUser: any = null;
  
  // Sample user data matching the image
  users = [
    { 
      id: 1, 
      fullName: 'Alisha Singhia', 
      role: 'Author Blogger', 
      joinedDate: '06/15/2022',
      firstName: 'Alisha',
      middleName: 'Singhia',
      email: 'alishasinghia@mail.com',
      location: 'Mumbai, India',
      sinceDate: '15 June 2022',
      bio: 'Passionate writer and avid traveler, Alisha Singhia shares insights from her adventures around the globe. With a background in journalism, she combines storytelling with a love for photography, capturing the essence of each destination.',
      learningHours: '3.2 hrs/week',
      pendingCourses: 1,
      ratedCourses: 4,
      learningHistory: [
        { course: 'Artificial Intelligence Professional Certificate', completion: 100, status: 'complete' },
        { course: 'Machine Learning A-Z: AI, Python & R', completion: 80, status: 'in-progress' },
        { course: 'Python for Data Science and Machine Learning Bootcamp', completion: 60, status: 'in-progress' },
        { course: 'Tableau for Beginners: Get Certified in Data Visualization', completion: 100, status: 'complete' },
        { course: 'Web Development Bootcamp', completion: 20, status: 'started' }
      ]
    },
    { 
      id: 2, 
      fullName: 'Anvita Parida', 
      role: 'Author', 
      joinedDate: '06/15/2022',
      firstName: 'Anvita',
      middleName: 'Parida',
      email: 'anvitaparida@mail.com',
      location: 'Delhi, India',
      sinceDate: '15 June 2022',
      bio: 'Creative content creator with expertise in digital marketing and social media strategy. Passionate about helping brands connect with their audiences through compelling storytelling.',
      learningHours: '5.1 hrs/week',
      pendingCourses: 3,
      ratedCourses: 8,
      learningHistory: [
        { course: 'Digital Marketing Masterclass', completion: 100, status: 'complete' },
        { course: 'Social Media Marketing', completion: 90, status: 'in-progress' },
        { course: 'Content Creation Fundamentals', completion: 100, status: 'complete' }
      ]
    },
    { 
      id: 3, 
      fullName: 'Ashvapati Verma', 
      role: 'Normal User', 
      joinedDate: '06/15/2022',
      firstName: 'Ashvapati',
      middleName: 'Verma',
      email: 'ashvapativerma@mail.com',
      location: 'Bangalore, India',
      sinceDate: '15 June 2022',
      bio: 'Software developer with a passion for learning new technologies. Enjoys building scalable applications and contributing to open-source projects.',
      learningHours: '2.8 hrs/week',
      pendingCourses: 2,
      ratedCourses: 5,
      learningHistory: [
        { course: 'Full Stack Web Development', completion: 75, status: 'in-progress' },
        { course: 'React.js Complete Guide', completion: 100, status: 'complete' },
        { course: 'Node.js Backend Development', completion: 40, status: 'in-progress' }
      ]
    },
    { 
      id: 4, 
      fullName: 'Balaji Khanderao Pandhawale', 
      role: 'Author', 
      joinedDate: '06/15/2022',
      firstName: 'Balaji',
      middleName: 'Khanderao Pandhawale',
      email: 'balajipandhawale@mail.com',
      location: 'Pune, India',
      sinceDate: '15 June 2022',
      bio: 'Experienced educator and technical writer with over 10 years in the field. Specializes in creating comprehensive learning materials for complex technical topics.',
      learningHours: '4.2 hrs/week',
      pendingCourses: 1,
      ratedCourses: 12,
      learningHistory: [
        { course: 'Advanced Data Structures', completion: 100, status: 'complete' },
        { course: 'System Design Fundamentals', completion: 85, status: 'in-progress' },
        { course: 'Cloud Architecture', completion: 100, status: 'complete' }
      ]
    },
    { 
      id: 5, 
      fullName: 'Bhavna Mishra', 
      role: 'Normal User', 
      joinedDate: '06/15/2022',
      firstName: 'Bhavna',
      middleName: 'Mishra',
      email: 'bhavnamishra@mail.com',
      location: 'Chennai, India',
      sinceDate: '15 June 2022',
      bio: 'UX/UI designer passionate about creating user-centered digital experiences. Believes in the power of design to solve complex problems and improve user satisfaction.',
      learningHours: '3.7 hrs/week',
      pendingCourses: 2,
      ratedCourses: 6,
      learningHistory: [
        { course: 'UI/UX Design Fundamentals', completion: 100, status: 'complete' },
        { course: 'Figma Masterclass', completion: 70, status: 'in-progress' },
        { course: 'Design Systems', completion: 100, status: 'complete' }
      ]
    },
    { 
      id: 6, 
      fullName: 'B Venkata Jagadish', 
      role: 'Author', 
      joinedDate: '06/15/2022',
      firstName: 'B Venkata',
      middleName: 'Jagadish',
      email: 'bvenkatajagadish@mail.com',
      location: 'Hyderabad, India',
      sinceDate: '15 June 2022',
      bio: 'Data scientist and machine learning enthusiast with expertise in predictive analytics and statistical modeling. Enjoys solving complex business problems through data-driven insights.',
      learningHours: '6.3 hrs/week',
      pendingCourses: 1,
      ratedCourses: 15,
      learningHistory: [
        { course: 'Machine Learning A-Z: AI, Python & R', completion: 100, status: 'complete' },
        { course: 'Deep Learning Specialization', completion: 90, status: 'in-progress' },
        { course: 'Natural Language Processing', completion: 100, status: 'complete' }
      ]
    },
    { 
      id: 7, 
      fullName: 'Chandan Khare', 
      role: 'Normal User', 
      joinedDate: '06/15/2022',
      firstName: 'Chandan',
      middleName: 'Khare',
      email: 'chandankhare@mail.com',
      location: 'Kolkata, India',
      sinceDate: '15 June 2022',
      bio: 'Business analyst with a strong foundation in data analysis and process improvement. Enjoys translating complex data into actionable business insights.',
      learningHours: '2.5 hrs/week',
      pendingCourses: 3,
      ratedCourses: 4,
      learningHistory: [
        { course: 'Business Analytics Fundamentals', completion: 80, status: 'in-progress' },
        { course: 'Excel for Business Analysis', completion: 100, status: 'complete' },
        { course: 'SQL for Data Analysis', completion: 60, status: 'in-progress' }
      ]
    },
    { 
      id: 8, 
      fullName: 'Debopriya De', 
      role: 'Author Blogger', 
      joinedDate: '06/15/2022',
      firstName: 'Debopriya',
      middleName: 'De',
      email: 'debopriyade@mail.com',
      location: 'Bangalore, India',
      sinceDate: '15 June 2022',
      bio: 'Creative writer and lifestyle blogger with a unique perspective on modern living. Combines personal experiences with research to create engaging content that resonates with readers.',
      learningHours: '4.8 hrs/week',
      pendingCourses: 2,
      ratedCourses: 9,
      learningHistory: [
        { course: 'Content Writing Masterclass', completion: 100, status: 'complete' },
        { course: 'SEO Fundamentals', completion: 85, status: 'in-progress' },
        { course: 'Creative Writing Workshop', completion: 100, status: 'complete' }
      ]
    },
    { 
      id: 9, 
      fullName: 'Dipyaman Deb', 
      role: 'Normal User', 
      joinedDate: '06/16/2022',
      firstName: 'Dipyaman',
      middleName: 'Deb',
      email: 'dipyamandeb@mail.com',
      location: 'Guwahati, India',
      sinceDate: '16 June 2022',
      bio: 'Student passionate about technology and innovation. Currently exploring various programming languages and frameworks to build a strong foundation in software development.',
      learningHours: '5.5 hrs/week',
      pendingCourses: 4,
      ratedCourses: 7,
      learningHistory: [
        { course: 'Python Programming for Beginners', completion: 100, status: 'complete' },
        { course: 'JavaScript Fundamentals', completion: 75, status: 'in-progress' },
        { course: 'Web Development Basics', completion: 90, status: 'in-progress' }
      ]
    },
    { 
      id: 10, 
      fullName: 'Gautam Uppal', 
      role: 'Author', 
      joinedDate: '06/15/2022',
      firstName: 'Gautam',
      middleName: 'Uppal',
      email: 'gautamuppal@mail.com',
      location: 'Chandigarh, India',
      sinceDate: '15 June 2022',
      bio: 'Experienced software architect with expertise in designing scalable systems and mentoring development teams. Passionate about clean code and best practices.',
      learningHours: '3.9 hrs/week',
      pendingCourses: 1,
      ratedCourses: 11,
      learningHistory: [
        { course: 'Software Architecture Patterns', completion: 100, status: 'complete' },
        { course: 'Microservices Design', completion: 80, status: 'in-progress' },
        { course: 'DevOps Fundamentals', completion: 100, status: 'complete' }
      ]
    }
  ];

  filteredUsers = [...this.users];
  totalUsers = 1250; // Total records as shown in the image

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.role !== 'Admin') {
        // Redirect non-admin users
        this.router.navigate(['/dashboard']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onUserSearch(): void {
    if (this.userSearchQuery.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.fullName.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.userSearchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  editUser(user: any): void {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveChanges(): void {
    // In a real application, this would save the changes to the backend
    alert('Changes saved successfully!');
    this.closeEditModal();
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'Author Blogger':
        return 'role-author-blogger';
      case 'Author':
        return 'role-author';
      case 'Normal User':
        return 'role-normal-user';
      default:
        return 'role-default';
    }
  }

  getCompletionStatusClass(completion: number): string {
    if (completion === 100) return 'status-complete';
    if (completion >= 60) return 'status-in-progress';
    return 'status-started';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
