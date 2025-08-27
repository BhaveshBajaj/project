export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrollmentDate: string;
  progress: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  completedLessons: number[];
  lastAccessDate: string;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface UserEnrollments {
  userId: number;
  enrollments: Enrollment[];
}
