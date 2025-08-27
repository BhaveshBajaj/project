export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  author: string;
  authorId?: number;
  readTime: string;
  publishedDate: string;
  category: string;
  tags: string[];
  views?: number;
  likes?: number;
}
