import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog';
import { AuthService } from '../../services/auth';
import { PermissionsService } from '../../services/permissions';
import { User } from '../../models/user';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss'
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  isLoading = true;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      const blogId = Number(params['id']);
      if (blogId) {
        this.loadBlog(blogId);
      }
    });
  }

  private loadBlog(blogId: number): void {
    this.isLoading = true;
    
    this.blogService.getBlogById(blogId).subscribe({
      next: (blog) => {
        this.blog = blog || null;
        this.isLoading = false;
        
        if (!this.blog) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onAuthorClick(): void {
    if (this.blog?.authorId) {
      this.router.navigate(['/author', this.blog.authorId]);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  onLike(): void {
    if (this.blog) {
      this.blog.likes = (this.blog.likes || 0) + 1;
    }
  }

  onEditBlog(): void {
    if (this.blog) {
      this.router.navigate(['/blog', this.blog.id, 'edit']);
    }
  }

  canEditBlog(): boolean {
    if (!this.blog || !this.currentUser || !this.blog.authorId) return false;
    return this.permissionsService.canEditBlog(this.blog.authorId);
  }
}