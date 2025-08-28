import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog';
import { AppData } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogs: Blog[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load from assets/data.json
      this.http.get<AppData>('assets/data.json').subscribe({
        next: (data) => {
          // Generate blog data based on courses and users
          this.blogs = this.generateBlogsFromData(data);
          console.log('Generated blogs from data:', this.blogs.length);
          this.dataLoaded = true;
        },
        error: (error) => {
          console.error('Failed to load data for blogs:', error);
          this.blogs = this.getMockBlogs();
          this.dataLoaded = true;
        }
      });
    } catch (error) {
      console.error('Error loading blog data:', error);
      this.blogs = this.getMockBlogs();
      this.dataLoaded = true;
    }
  }

  private generateBlogsFromData(data: AppData): Blog[] {
    const blogs: Blog[] = [];
    const authors = data.users.filter(user => user.role === 'Author');
    
    // Create blogs based on courses and authors
    data.courses.forEach((course, index) => {
      const author = authors.find(a => a.id === course.authorId) || authors[0];
      if (author) {
        const blog: Blog = {
          id: course.id,
          title: `Mastering ${course.title}: Expert Tips and Insights`,
          excerpt: course.subtitle || `Learn everything you need to know about ${course.title} from industry experts.`,
          content: this.generateBlogContent(course),
          imageUrl: course.thumbnailUrl,
          author: author.fullName,
          authorId: author.id,
          readTime: '5 min read',
          publishedDate: course.publishedDate,
          category: course.difficulty || 'Technology',
          tags: course.skills.slice(0, 3),
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 50) + 10
        };
        blogs.push(blog);
      }
    });

    // Add some additional general blogs
    const additionalBlogs: Blog[] = [
      {
        id: 1001,
        title: 'The Future of Online Learning: Trends to Watch in 2024',
        excerpt: 'Explore the emerging trends shaping the future of digital education and how they impact learners worldwide.',
        content: this.generateGeneralBlogContent('future-learning'),
        imageUrl: 'https://i.imgur.com/future-learning.png',
        author: authors[0]?.fullName || 'Learning Expert',
        authorId: authors[0]?.id || 1,
        readTime: '8 min read',
        publishedDate: '2024-01-15T00:00:00.000Z',
        category: 'Education',
        tags: ['Online Learning', 'Technology', 'Future'],
        views: 1250,
        likes: 89
      },
      {
        id: 1002,
        title: 'Building a Successful Career in Data Science',
        excerpt: 'A comprehensive guide to starting and advancing your career in the exciting field of data science.',
        content: this.generateGeneralBlogContent('data-science-career'),
        imageUrl: 'https://i.imgur.com/data-science.png',
        author: authors[1]?.fullName || 'Data Expert',
        authorId: authors[1]?.id || 2,
        readTime: '10 min read',
        publishedDate: '2024-01-10T00:00:00.000Z',
        category: 'Career',
        tags: ['Data Science', 'Career', 'Skills'],
        views: 890,
        likes: 67
      }
    ];

    return [...blogs, ...additionalBlogs];
  }

  private generateBlogContent(course: any): string {
    return `
      <h2>Introduction to ${course.title}</h2>
      <p>${course.subtitle || 'This comprehensive course covers everything you need to know about this exciting topic.'}</p>
      
      <h3>What You'll Learn</h3>
      <p>In this course, you'll master the following skills:</p>
      <ul>
        ${course.skills.map((skill: string) => `<li>${skill}</li>`).join('')}
      </ul>
      
      ${course.whatYoullLearn && course.whatYoullLearn.length > 0 ? `
      <h3>Key Learning Outcomes</h3>
      <ul>
        ${course.whatYoullLearn.map((outcome: string) => `<li>${outcome}</li>`).join('')}
      </ul>
      ` : ''}
      
      <h3>Getting Started</h3>
      <p>This course is designed for ${course.difficulty.toLowerCase()} level learners and takes approximately ${course.durationText || '6 weeks'} to complete.</p>
      
      ${course.requirements && course.requirements.length > 0 ? `
      <h3>Prerequisites</h3>
      <ul>
        ${course.requirements.map((req: string) => `<li>${req}</li>`).join('')}
      </ul>
      ` : ''}
      
      <h3>Why Choose This Course?</h3>
      <p>With a rating of ${course.rating}/5 and over ${course.enrollmentCount || course.reviewCount} enrolled students, this course has proven to deliver excellent results for learners worldwide.</p>
      
      <h3>Conclusion</h3>
      <p>Ready to begin your learning journey? Enroll now and join thousands of students who have already transformed their careers with this course.</p>
    `;
  }

  private generateGeneralBlogContent(type: string): string {
    if (type === 'future-learning') {
      return `
        <h2>The Evolution of Digital Education</h2>
        <p>The landscape of online learning has transformed dramatically over the past few years, accelerated by global changes and technological advancements.</p>
        
        <h3>Key Trends Shaping Online Learning</h3>
        <ul>
          <li><strong>Microlearning:</strong> Bite-sized content that fits into busy schedules</li>
          <li><strong>AI-Powered Personalization:</strong> Customized learning paths for each student</li>
          <li><strong>Virtual and Augmented Reality:</strong> Immersive learning experiences</li>
          <li><strong>Social Learning:</strong> Collaborative online communities</li>
        </ul>
        
        <h3>The Future is Here</h3>
        <p>As we move forward, online learning continues to break down barriers and create opportunities for learners worldwide.</p>
      `;
    } else if (type === 'data-science-career') {
      return `
        <h2>Building Your Data Science Foundation</h2>
        <p>Data science is one of the fastest-growing fields in technology, offering exciting opportunities for those with the right skills.</p>
        
        <h3>Essential Skills for Data Scientists</h3>
        <ul>
          <li>Programming (Python, R, SQL)</li>
          <li>Statistics and Mathematics</li>
          <li>Data Visualization</li>
          <li>Machine Learning</li>
          <li>Domain Expertise</li>
        </ul>
        
        <h3>Career Path and Growth</h3>
        <p>Start with entry-level positions and grow into specialized roles like ML Engineer, Data Analyst, or Chief Data Officer.</p>
      `;
    }
    return '<p>Coming soon...</p>';
  }

  private getMockBlogs(): Blog[] {
    return [
      {
        id: 1,
        title: 'Mastering Google Data Analytics: A Complete Guide',
        excerpt: 'Discover the power of Google Analytics and learn how to transform raw data into actionable insights for your business.',
        content: '<h2>Mock Content</h2><p>This is mock blog content.</p>',
        imageUrl: 'https://i.imgur.com/3q6CqYq.png',
        author: 'Stephane Maarek',
        authorId: 2,
        readTime: '5 min read',
        publishedDate: '2024-01-15T00:00:00.000Z',
        category: 'Analytics',
        tags: ['Google Analytics', 'Data', 'Business Intelligence'],
        views: 1205,
        likes: 89
      }
    ];
  }

  getAllBlogs(): Observable<Blog[]> {
    return of(this.blogs);
  }

  getBlogById(id: number): Observable<Blog | undefined> {
    const blog = this.blogs.find(b => b.id === id);
    return of(blog);
  }

  getBlogsByAuthor(authorId: number): Observable<Blog[]> {
    const authorBlogs = this.blogs.filter(blog => blog.authorId === authorId);
    return of(authorBlogs);
  }

  getBlogsByCategory(category: string): Observable<Blog[]> {
    const categoryBlogs = this.blogs.filter(blog => 
      blog.category.toLowerCase() === category.toLowerCase()
    );
    return of(categoryBlogs);
  }

  searchBlogs(query: string): Observable<Blog[]> {
    const filteredBlogs = this.blogs.filter(blog =>
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filteredBlogs);
  }

  getFeaturedBlogs(limit: number = 3): Observable<Blog[]> {
    // Return blogs with highest views
    const sorted = [...this.blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
    return of(sorted.slice(0, limit));
  }
}
