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
  reviewCount?: number;
  reviewsCount?: number; // For backward compatibility
  enrollmentCount?: number;
  studentsCount?: number; // For backward compatibility
  difficulty: string;
  durationText?: string;
  duration?: string; // For backward compatibility
  skills: string[];
  whatYoullLearn?: string[];
  requirements: string[];
  status?: string;
  publishedDate: string;
  
  // Optional fields for backward compatibility
  lastUpdated?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  languages?: string[];
  subtitles?: string[];
  category?: string;
  subCategory?: string;
  description?: string;
  objectives?: string[];
  targetAudience?: string[];
  syllabus?: Array<{
    sectionId: number;
    sectionTitle: string;
    lessons: Array<{
      lessonId: number;
      lessonTitle: string;
      duration: string;
      isPreview: boolean;
    }>;
  }>;
  isNewlyLaunched?: boolean;
  isBestseller?: boolean;
  hasCaption?: boolean;
  hasCertificate?: boolean;
  features?: string[];
  
  // New fields for enhanced course page
  videoContent?: VideoContent;
  quizzes?: CourseQuiz[];
  learningPath?: LearningPathItem[];
  
  // Quiz questions for course creation
  quizQuestions?: QuizQuestion[];
}

// New interfaces for the JSON data structure
export interface Curriculum {
  [courseId: string]: Section[];
}

export interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

export interface Lecture {
  id: number;
  title: string;
  type: 'Text' | 'Video' | 'PDF';
  durationMinutes: number;
  content: {
    htmlContent?: string;
    videoUrl?: string;
    fileUrl?: string;
  };
}

export interface Quiz {
  [courseId: string]: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Review {
  userId: number;
  rating: number;
  comment: string;
}

export interface CourseReviews {
  [courseId: string]: Review[];
}

export interface Banner {
  id: number;
  imageUrl: string;
  status: 'active' | 'scheduled' | 'inactive';
  scheduleDate: string | null;
  expiryDate: string | null;
}

// New interfaces for enhanced course page
export interface VideoContent {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  currentTime?: string;
  progress?: number;
}

export interface CourseQuiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore?: number;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options: QuizOption[];
  correctAnswerIndex?: number;
  explanation?: string;
}

// Interface for course creation quiz questions
export interface CourseCreationQuizQuestion {
  id: string;
  questionText: string;
  options: CourseCreationQuizOption[];
}

export interface CourseCreationQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface LearningPathItem {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  content?: {
    videoUrl?: string;
    textContent?: string;
    quizId?: number;
  };
}

export interface CourseProgress {
  courseId: number;
  userId: number;
  completedItems: number[];
  currentItemId: number;
  overallProgress: number;
  timeSpent: number;
  lastAccessed: string;
}

export interface CourseAnalytics {
  courseId: number;
  totalViews: number;
  averageRating: number;
  completionRate: number;
  engagementMetrics: {
    averageTimeSpent: number;
    dropOffPoints: number[];
    mostReplayedSections: number[];
  };
}
