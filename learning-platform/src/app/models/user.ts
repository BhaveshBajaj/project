export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  track: string | null;
  avatarUrl: string;
  joinDate: string;
  role: string;
  bio: string | null;
  location: string | null;
}
