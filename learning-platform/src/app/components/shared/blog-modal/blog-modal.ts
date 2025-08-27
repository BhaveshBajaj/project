import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from '../../../models/blog';

@Component({
  selector: 'app-blog-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-modal.html',
  styleUrl: './blog-modal.scss'
})
export class BlogModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = 'All Blogs';
  @Input() blogs: Blog[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() blogSelected = new EventEmitter<Blog>();

  ngOnInit(): void {
    // Handle escape key to close modal
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onBlogClick(blog: Blog): void {
    this.blogSelected.emit(blog);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
