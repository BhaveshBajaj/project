import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss'
})
export class BlogCardComponent {
  @Input() blog: {
    id: number;
    title: string;
    imageUrl: string;
    author: string;
    readTime: string;
  } = {
    id: 1,
    title: 'Google Data Analytics',
    imageUrl: 'https://i.imgur.com/3q6CqYq.png',
    author: 'John Doe',
    readTime: '5 min read'
  };
}
