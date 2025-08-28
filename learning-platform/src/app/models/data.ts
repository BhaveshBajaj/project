import { User } from './user';
import { Course, Curriculum, Quiz, CourseReviews, Banner } from './course';

export interface AppData {
  users: User[];
  courses: Course[];
  curriculum: Curriculum;
  quizzes: Quiz;
  reviews: CourseReviews;
  userEnrollments: UserEnrollments;
  banners: Banner[];
}

export interface UserEnrollments {
  [userId: string]: {
    courseId: number;
    progressPercent: number;
  }[];
}
