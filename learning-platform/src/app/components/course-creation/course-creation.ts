import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { AuthService } from '../../services/auth';

interface Module {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  duration: string;
  description?: string;
  videoUrl?: string;
  content?: string;
}

@Component({
  selector: 'app-course-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './course-creation.html',
  styleUrl: './course-creation.scss'
})
export class CourseCreationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  
  // Forms
  basicDetailsForm!: FormGroup;
  
  // Course data
  courseData: any = {
    title: '',
    description: '',
    level: '',
    duration: '',
    thumbnail: null,
    whatYouWillLearn: '',
    prerequisites: '',
    courseRequirements: ''
  };

  // Validation errors
  validationErrors: any = {};
  
  // Course content
  modules: Module[] = [];
  
  // Modal states
  showAddLectureModal = false;
  showPublishSuccessModal = false;
  editingModule: Module | null = null;
  
  // Lecture form
  lectureForm: any = {
    type: 'video',
    title: '',
    description: '',
    videoFile: null,
    videoUrl: ''
  };
  
  // Steps configuration
  steps = [
    { number: 1, title: 'Basic Details', completed: false },
    { number: 2, title: 'Course Content', completed: false },
    { number: 3, title: 'Overview', completed: false },
    { number: 4, title: 'Quiz', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.addDefaultModule();
  }

  initializeForms() {
    this.basicDetailsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      level: ['', Validators.required],
      duration: [''],
      whatYouWillLearn: [''],
      prerequisites: [''],
      courseRequirements: ['']
    });
  }



  addDefaultModule() {
    const defaultModule: Module = {
      id: this.generateId(),
      title: 'Introduction',
      lectures: [
        {
          id: this.generateId(),
          title: 'Course Overview',
          type: 'text',
          duration: '5 min read',
          description: 'Text'
        },
        {
          id: this.generateId(),
          title: 'Google Analytics Overview',
          type: 'video',
          duration: '5 min read',
          description: 'Video'
        },
        {
          id: this.generateId(),
          title: 'How to Set Up a Google Analytics Demo Account',
          type: 'pdf',
          duration: '5 min read',
          description: 'PDF'
        },
        {
          id: this.generateId(),
          title: 'Google Analytics Dictionary - The Top 50 Terms to Know',
          type: 'pdf',
          duration: '5 min read',
          description: 'PDF'
        },
        {
          id: this.generateId(),
          title: 'A Note on Google Analytics 4 Setup',
          type: 'pdf',
          duration: '5 min read',
          description: 'PDF'
        }
      ]
    };
    this.modules.push(defaultModule);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Step navigation
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.steps[this.currentStep - 1].completed = true;
        this.currentStep++;
      } else {
        // Show validation errors
        this.scrollToFirstError();
      }
    }
  }

  scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  validateCurrentStep(): boolean {
    this.validationErrors = {};
    let isValid = true;

    switch (this.currentStep) {
      case 1:
        // Basic Details validation
        if (!this.basicDetailsForm.get('title')?.value?.trim()) {
          this.validationErrors.title = 'Course title is required';
          isValid = false;
        }
        if (!this.basicDetailsForm.get('description')?.value?.trim()) {
          this.validationErrors.description = 'Course description is required';
          isValid = false;
        }
        if (isValid) {
          this.courseData = { ...this.courseData, ...this.basicDetailsForm.value };
        }
        break;
      
      case 2:
        // Course Content validation
        if (this.modules.length === 0) {
          this.validationErrors.modules = 'At least one module is required';
          isValid = false;
        } else {
          // Check if modules have titles and lectures
          for (let i = 0; i < this.modules.length; i++) {
            const module = this.modules[i];
            if (!module.title?.trim()) {
              this.validationErrors[`module_${i}_title`] = `Module ${i + 1} title is required`;
              isValid = false;
            }
            if (module.lectures.length === 0) {
              this.validationErrors[`module_${i}_lectures`] = `Module ${i + 1} must have at least one lecture`;
              isValid = false;
            }
          }
        }
        break;
      
      case 3:
        // Overview validation - optional fields, no strict validation needed
        break;
      
      case 4:
        // Quiz validation - optional for now
        break;
    }

    return isValid;
  }

  // Course content methods
  addNewSection() {
    const newModule: Module = {
      id: this.generateId(),
      title: '',
      lectures: []
    };
    this.modules.push(newModule);
  }

  openAddLectureModal(module: Module) {
    this.editingModule = module;
    this.showAddLectureModal = true;
    this.resetLectureForm();
  }

  closeAddLectureModal() {
    this.showAddLectureModal = false;
    this.editingModule = null;
    this.resetLectureForm();
  }

  resetLectureForm() {
    this.lectureForm = {
      type: 'video',
      title: '',
      description: '',
      videoFile: null,
      videoUrl: ''
    };
  }

  addLecture() {
    if (!this.editingModule || !this.lectureForm.title) return;

    const newLecture: Lecture = {
      id: this.generateId(),
      title: this.lectureForm.title,
      type: this.lectureForm.type,
      duration: '5 min read',
      description: this.lectureForm.description,
      videoUrl: this.lectureForm.videoUrl,
      content: this.lectureForm.description
    };

    this.editingModule.lectures.push(newLecture);
    this.closeAddLectureModal();
  }

  deleteLecture(moduleId: string, lectureId: string) {
    if (confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      const module = this.modules.find(m => m.id === moduleId);
      if (module) {
        module.lectures = module.lectures.filter(l => l.id !== lectureId);
      }
    }
  }

  deleteModule(moduleId: string) {
    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      this.modules = this.modules.filter(m => m.id !== moduleId);
    }
  }

  // File upload methods
  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.courseData.thumbnail = file;
    }
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.lectureForm.videoFile = file;
    }
  }

  // Publish course
  publishCourse() {
    // Validate all steps
    let allStepsValid = true;
    
    // Validate each step
    for (let step = 1; step <= this.totalSteps; step++) {
      const originalStep = this.currentStep;
      this.currentStep = step;
      if (!this.validateCurrentStep()) {
        allStepsValid = false;
        break;
      }
      this.currentStep = originalStep;
    }

    if (!allStepsValid) {
      alert('Please complete all required fields before publishing.');
      return;
    }

    // Get current user (author)
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('You must be logged in to publish a course.');
      return;
    }
    
    // Prepare course data
    const courseToPublish = {
      id: this.generateId(),
      title: this.courseData.title,
      subtitle: this.courseData.description,
      description: this.courseData.description,
      thumbnailUrl: this.courseData.thumbnail || 'https://i.imgur.com/placeholder.png',
      rating: 0,
      reviewsCount: 0,
      studentsCount: 0,
      duration: this.calculateTotalDuration(),
      difficulty: this.courseData.level || 'Beginner',
      price: 0,
      originalPrice: 0,
      skills: this.extractSkillsFromContent(),
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      publishedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      modules: this.modules,
      status: 'published',
      category: 'General',
      language: 'English',
      whatYouWillLearn: this.courseData.whatYouWillLearn || '',
      prerequisites: this.courseData.prerequisites || '',
      requirements: this.courseData.courseRequirements || ''
    };

    // Save course using CourseService
    this.courseService.createCourse(courseToPublish).subscribe({
      next: (response) => {
        console.log('Course published successfully:', response);
        this.showPublishSuccessModal = true;
      },
      error: (error) => {
        console.error('Error publishing course:', error);
        alert('Failed to publish course. Please try again.');
      }
    });
  }

  calculateTotalDuration(): string {
    const totalMinutes = this.modules.reduce((total, module) => {
      return total + (module.lectures.length * 5); // Assuming 5 minutes per lecture
    }, 0);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  }

  extractSkillsFromContent(): string[] {
    const skills: string[] = [];
    
    // Extract skills from course title and description
    const text = `${this.courseData.title} ${this.courseData.description}`.toLowerCase();
    
    // Common skill keywords
    const skillKeywords = [
      'javascript', 'python', 'react', 'angular', 'vue', 'nodejs', 'typescript',
      'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker',
      'kubernetes', 'git', 'data science', 'machine learning', 'ai', 'analytics',
      'design', 'ui/ux', 'photoshop', 'figma', 'marketing', 'seo', 'business'
    ];
    
    skillKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        skills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    // If no skills found, add generic ones based on modules
    if (skills.length === 0) {
      this.modules.forEach(module => {
        skills.push(module.title);
      });
    }
    
    return skills.slice(0, 5); // Limit to 5 skills
  }

  closeSuccessModal() {
    this.showPublishSuccessModal = false;
    this.router.navigate(['/dashboard']);
  }

  // Navigation
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getLectureIcon(type: string): string {
    switch (type) {
      case 'video': return '▶️';
      case 'pdf': return '📄';
      case 'text': return '📝';
      default: return '📄';
    }
  }

  getLectureCount(module: Module): string {
    const count = module.lectures.length;
    const totalMinutes = count * 5; // Assuming 5 minutes per lecture for simplicity
    
    return `${count} Lectures · ${totalMinutes} mins`;
  }
}
