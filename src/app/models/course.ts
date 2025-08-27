export interface Provider {
  name: string;
  logoUrl: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  authorId: number;
  provider: Provider;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  difficulty: string;
  durationText: string;
  skills: string[];
  whatYoullLearn: string[];
  requirements: string[];
  status: string;
  publishedDate: string;
}
