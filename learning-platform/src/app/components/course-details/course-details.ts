import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course';

interface CourseContentItem {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'text';
  completed: boolean;
}

interface AdditionalSection {
  id: number;
  title: string;
  duration: string;
  expanded: boolean;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  options: QuizOption[];
  explanation?: string;
  correctAnswerIndex: number;
}

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface Testimonial {
  id: number;
  rating: number;
  text: string;
  authorName: string;
  authorTitle: string;
  avatar: string;
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
  activeTab = 'overview';
  
  // Video player properties
  videoProgress = 35;
  currentTime = '1:32';
  totalTime = '4:30';
  
  // Content sidebar properties
  activeContentIndex = 1;
  
  // Quiz properties
  showQuizModal = false;
  totalQuestions = 0;
  questionAnswers: (number | null)[] = [];
  questionFeedback: boolean[] = []; // Track which questions have been answered and feedback shown
  showResults = false;
  quizCompleted = false;
  correctAnswers = 0;
  hasQuizData = false; // Track if course has quiz questions
  
  // Learning content
  learningObjectives: string[] = [
    'Learn how to become understanding of the position and processes used by a typical analyst when they analyze a business and develop a solution.',
    'Understand how to clean and organize data for analysis and understand analysis and analytical data and analytical data.',
    'Gain practical skills and experience.',
    'Learn how to use Google Analytics.',
  ];
  
  skillsTags: string[] = [
    'Data Analytics',
    'Data Visualization',
    'SQL',
    'Spreadsheets',
    'Data Cleaning'
  ];
  
  requirementsList: string[] = [
    'No experience required. If you can use a web browser, you can get started on this path.',
    'Familiarity with basic computer operations.'
  ];
  
  courseDescription = 'Gain master Google Analytics and the data-to-decision-making, and start exploring the performance of your website. Learn the fundamentals of digital analytics and how to use Google Analytics to analyze the performance of your website and mobile apps to make data-driven decisions.';
  
  authorBio = 'Stephane is a solutions architect, consultant and software developer that has a particular interest in all things related to Cloud and Big Data. He\'s also a many-times best selling instructor on Udemy for his courses in AWS and Apache Kafka.';
  
  courseContentItems: CourseContentItem[] = [
    { id: 1, title: '1. Course Overview', duration: '3min', type: 'video', completed: true },
    { id: 2, title: '2. Google Analytics Overview', duration: '5min', type: 'video', completed: false },
    { id: 3, title: '3. How to Set Up a Google Analytics Data Account', duration: '8min', type: 'text', completed: false },
    { id: 4, title: '4. A Guide on Google Analytics 4 Setup', duration: '6min', type: 'video', completed: false },
    { id: 5, title: '5. How To Setup Google Analytics Like A Pro', duration: '8min', type: 'video', completed: false },
    { id: 6, title: '6. How To Analyze Reports & Increase Traffic And Sales', duration: '10min', type: 'text', completed: false },
  ];
  
  additionalSections: AdditionalSection[] = [
    { id: 1, title: 'Section 2: How to Analyze Reports & Increase Traffic And Sales', duration: '3min', expanded: false },
    { id: 2, title: 'Section 3: Google Analytics Dictionary - The Top 20 Terms to Know', duration: '3min', expanded: false },
    { id: 3, title: 'Section 4: Conclusion', duration: '3min', expanded: false },
  ];
  
  quizQuestions: QuizQuestion[] = [];

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
        } else {
          // Load quiz questions for this course
          this.loadQuizQuestions(courseId);
        }
      },
      error: (error: any) => {
        console.error('Error loading course:', error);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  private loadQuizQuestions(courseId: number): void {
    console.log('🔍 Loading quiz questions for course ID:', courseId);
    
    this.courseService.getQuizzes(courseId).subscribe({
      next: (quizData: any[]) => {
        console.log('📊 Raw quiz data received:', quizData);
        
        // Transform the quiz data from data.json format to component format
        this.quizQuestions = quizData.map((question: any) => ({
          id: question.id,
          questionText: question.questionText,
          options: question.options,
          correctAnswerIndex: question.options.findIndex((option: any) => option.isCorrect),
          explanation: question.explanation || 'Well done! You got it right.'
        }));
        
        // Update hasQuizData flag
        this.hasQuizData = this.quizQuestions.length > 0;
        
        console.log('✅ Transformed quiz questions:', this.quizQuestions);
        console.log('🎯 Has quiz data:', this.hasQuizData);
        console.log('📝 Quiz questions length:', this.quizQuestions.length);
      },
      error: (error: any) => {
        console.error('❌ Error loading quiz questions:', error);
        // Fallback to empty array if no quiz data is found
        this.quizQuestions = [];
        this.hasQuizData = false;
        console.log('⚠️ Set hasQuizData to false due to error');
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSection(sectionId: number): void {
    const section = this.additionalSections.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }
  
  selectContentItem(index: number): void {
    this.activeContentIndex = index;
    // Here you would typically load the content for the selected item
    console.log('Selected content item:', this.courseContentItems[index]);
  }
  
  playVideo(): void {
    console.log('Playing video...');
    // Here you would implement video playback logic
  }
  
  startQuiz(): void {
    // This method should only be called when hasQuizData is true
    // since the button is conditionally shown
    this.showQuizModal = true;
    this.totalQuestions = this.quizQuestions.length;
    this.questionAnswers = new Array(this.totalQuestions).fill(null);
    this.questionFeedback = new Array(this.totalQuestions).fill(false);
    this.showResults = false;
    this.quizCompleted = false;
    this.correctAnswers = 0;
  }
  
  closeQuiz(): void {
    this.showQuizModal = false;
    this.resetQuiz();
  }
  
  onAnswerSelected(questionIndex: number, answerIndex: number): void {
    this.questionAnswers[questionIndex] = answerIndex;
  }
  
  submitAnswer(questionIndex: number): void {
    if (this.questionAnswers[questionIndex] !== null) {
      this.questionFeedback[questionIndex] = true;
      console.log(`Submitted answer for question ${questionIndex + 1}`);
    }
  }
  
  getAllAnswered(): boolean {
    return this.questionAnswers.every(answer => answer !== null);
  }
  
  isQuestionAnswered(questionIndex: number): boolean {
    return this.questionAnswers[questionIndex] !== null;
  }
  
  hasQuestionFeedback(questionIndex: number): boolean {
    return this.questionFeedback[questionIndex];
  }
  
  isAnswerCorrect(questionIndex: number): boolean {
    return this.questionAnswers[questionIndex] === this.quizQuestions[questionIndex].correctAnswerIndex;
  }
  
  submitAllAnswers(): void {
    this.showResults = true;
    this.calculateScore();
    
    // Show results for a few seconds, then show completion screen
    setTimeout(() => {
      this.quizCompleted = true;
    }, 3000);
  }
  
  calculateScore(): void {
    this.correctAnswers = 0;
    this.questionAnswers.forEach((answer, index) => {
      if (answer === this.quizQuestions[index].correctAnswerIndex) {
        this.correctAnswers++;
      }
    });
  }
  
  retakeQuiz(): void {
    this.resetQuiz();
    this.startQuiz();
  }
  
  private resetQuiz(): void {
    this.questionAnswers = [];
    this.questionFeedback = [];
    this.showResults = false;
    this.quizCompleted = false;
    this.correctAnswers = 0;
  }



  goBack(): void {
    this.router.navigate(['/dashboard']);
  }



  navigateHome(): void {
    this.router.navigate(['/dashboard']);
  }
}