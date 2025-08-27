import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  currentUser: User | null = null;
  showSearchSuggestions = false;
  searchSuggestions = [
    'Learn Python Programming',
    'Advanced Python Programming',
    'Python Network Programming',
    'Python Object Oriented Programming',
    'Learn Advance Python Programming'
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  onSearchInput(): void {
    this.showSearchSuggestions = this.searchQuery.length > 0;
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.showSearchSuggestions = false;
    }
  }

  onSuggestionClick(suggestion: string): void {
    this.searchQuery = suggestion;
    this.onSearchSubmit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
