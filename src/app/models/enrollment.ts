export interface Enrollment {
  courseId: number;
  progressPercent: number;
}

export interface UserEnrollments {
  [userId: string]: Enrollment[];
}
