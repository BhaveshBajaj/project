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
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  lastUpdated: string;
  difficulty: string;
  price: number;
  originalPrice: number;
  discount: number;
  languages: string[];
  subtitles: string[];
  skills: string[];
  category: string;
  subCategory: string;
  description: string;
  objectives: string[];
  requirements: string[];
  targetAudience: string[];
  syllabus: Array<{
    sectionId: number;
    sectionTitle: string;
    lessons: Array<{
      lessonId: number;
      lessonTitle: string;
      duration: string;
      isPreview: boolean;
    }>;
  }>;
  publishedDate: string;
  isNewlyLaunched: boolean;
  isBestseller: boolean;
  hasCaption: boolean;
  hasCertificate: boolean;
  features: string[];
}
