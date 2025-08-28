import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-edit.html',
  styleUrl: './blog-edit.scss'
})
export class BlogEditComponent implements OnInit {
  blog: Blog | null = null;
  isLoading = true;
  isSaving = false;
  
  // Form fields
  editForm = {
    title: '',
    category: '',
    content: ''
  };

  categories = [
    'Cybersecurity',
    'Technology', 
    'Analytics',
    'Career',
    'Education',
    'Data Science',
    'Programming',
    'Cloud Computing'
  ];

  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in and has author role
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (!user || (user.role !== 'Author' && user.role !== 'Admin')) {
        alert('Only authors can edit blogs.');
        this.router.navigate(['/dashboard']);
        return;
      }
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
        if (blog) {
          this.blog = blog;
          this.editForm = {
            title: blog.title,
            category: blog.category,
            content: this.stripHtmlTags(blog.content || '')
          };
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onBack(): void {
    if (this.blog) {
      this.router.navigate(['/blog', this.blog.id]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onSave(): void {
    if (!this.blog || this.isSaving) return;

    this.isSaving = true;

    // Update the blog object
    const updatedBlog: Blog = {
      ...this.blog,
      title: this.editForm.title,
      category: this.editForm.category,
      content: this.formatTextToHtml(this.editForm.content)
    };

    // Save to data.json via service
    this.blogService.updateBlog(updatedBlog).subscribe({
      next: () => {
        this.isSaving = false;
        // Navigate back to blog detail page
        this.router.navigate(['/blog', this.blog!.id]);
      },
      error: (error) => {
        console.error('Error saving blog:', error);
        this.isSaving = false;
        alert('Failed to save blog. Please try again.');
      }
    });
  }

  onSaveDraft(): void {
    // For now, same as save
    this.onSave();
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    
    // First, replace common HTML elements with appropriate text formatting
    let text = html
      // Replace headers with text and double line breaks
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
      // Replace paragraphs with text and double line breaks
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      // Replace list items with bullet points
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
      // Replace line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Replace unordered lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      // Replace ordered lists  
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '');
    
    // Clean up whitespace and line breaks
    text = text
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .replace(/\n /g, '\n') // Remove spaces at beginning of lines
      .replace(/ \n/g, '\n') // Remove spaces at end of lines
      .trim();
    
    return text;
  }

  private formatTextToHtml(text: string): string {
    if (!text) return '';
    
    // Split text into sections by double line breaks
    const sections = text.split('\n\n').filter(section => section.trim());
    
    // Convert each section to appropriate HTML
    const htmlSections = sections.map(section => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return '';
      
      // Check if section contains bullet points
      if (trimmedSection.includes('• ')) {
        const listItems = trimmedSection
          .split('\n')
          .filter(line => line.trim().startsWith('• '))
          .map(line => line.replace('• ', '').trim())
          .filter(item => item);
        
        if (listItems.length > 0) {
          return `<ul>\n${listItems.map(item => `  <li>${item}</li>`).join('\n')}\n</ul>`;
        }
      }
      
      // Check if it looks like a heading (short line, usually first section or after lists)
      if (trimmedSection.length < 100 && !trimmedSection.includes('.') && !trimmedSection.includes(',')) {
        return `<h3>${trimmedSection}</h3>`;
      }
      
      // Regular paragraph
      return `<p>${trimmedSection}</p>`;
    }).filter(section => section);
    
    return htmlSections.join('\n\n');
  }
}
