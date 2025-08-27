import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  selected?: boolean;
}

export interface FilterGroup {
  title: string;
  key: string;
  options: FilterOption[];
  multiSelect: boolean;
}

export interface FilterState {
  [key: string]: string[] | string;
}

@Component({
  selector: 'app-sidebar-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-filters.html',
  styleUrl: './sidebar-filters.scss'
})
export class SidebarFiltersComponent {
  @Output() filtersChanged = new EventEmitter<FilterState>();

  searchQuery = '';
  
  filterGroups: FilterGroup[] = [
    {
      title: 'Courses',
      key: 'courseType',
      multiSelect: false,
      options: [
        { id: 'all', label: 'All Courses', count: 1234, selected: true },
        { id: 'enrolled', label: 'Enrolled Courses', count: 23 },
        { id: 'completed', label: 'Completed', count: 12 },
        { id: 'in-progress', label: 'In Progress', count: 8 },
        { id: 'certificates', label: 'Certificates', count: 15 },
        { id: 'bookmarks', label: 'Bookmarks', count: 45 }
      ]
    },
    {
      title: 'Rating',
      key: 'rating',
      multiSelect: true,
      options: [
        { id: '5', label: '★★★★★ 5.0', count: 234 },
        { id: '4', label: '★★★★☆ 4.0 & up', count: 567 },
        { id: '3', label: '★★★☆☆ 3.0 & up', count: 890 },
        { id: '2', label: '★★☆☆☆ 2.0 & up', count: 123 },
        { id: '1', label: '★☆☆☆☆ 1.0 & up', count: 45 }
      ]
    },
    {
      title: 'Published Date',
      key: 'publishedDate',
      multiSelect: false,
      options: [
        { id: 'anytime', label: 'Any time', count: 1234, selected: true },
        { id: 'last-week', label: 'Last week', count: 56 },
        { id: 'last-month', label: 'Last month', count: 234 },
        { id: 'last-year', label: 'Last year', count: 567 }
      ]
    },
    {
      title: 'Categories',
      key: 'categories',
      multiSelect: true,
      options: [
        { id: 'data-science', label: 'Data Science', count: 345 },
        { id: 'programming', label: 'Programming', count: 456 },
        { id: 'machine-learning', label: 'Machine Learning', count: 234 },
        { id: 'web-development', label: 'Web Development', count: 567 },
        { id: 'mobile-dev', label: 'Mobile Development', count: 123 },
        { id: 'cloud-computing', label: 'Cloud Computing', count: 234 },
        { id: 'cybersecurity', label: 'Cybersecurity', count: 178 },
        { id: 'ui-ux', label: 'UI/UX Design', count: 234 }
      ]
    },
    {
      title: 'Course Level',
      key: 'level',
      multiSelect: true,
      options: [
        { id: 'beginner', label: 'Beginner', count: 456 },
        { id: 'intermediate', label: 'Intermediate', count: 345 },
        { id: 'advanced', label: 'Advanced', count: 234 },
        { id: 'expert', label: 'Expert', count: 123 }
      ]
    }
  ];

  currentFilters: FilterState = {
    courseType: 'all',
    publishedDate: 'anytime',
    rating: [],
    categories: [],
    level: []
  };

  onFilterChange(groupKey: string, optionId: string, isMultiSelect: boolean): void {
    if (isMultiSelect) {
      const currentValues = this.currentFilters[groupKey] as string[];
      const index = currentValues.indexOf(optionId);
      
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(optionId);
      }
    } else {
      this.currentFilters[groupKey] = optionId;
      
      // Update selected state for single select
      const group = this.filterGroups.find(g => g.key === groupKey);
      if (group) {
        group.options.forEach(option => {
          option.selected = option.id === optionId;
        });
      }
    }

    this.filtersChanged.emit({ ...this.currentFilters });
  }

  isOptionSelected(groupKey: string, optionId: string, isMultiSelect: boolean): boolean {
    if (isMultiSelect) {
      return (this.currentFilters[groupKey] as string[]).includes(optionId);
    } else {
      return this.currentFilters[groupKey] === optionId;
    }
  }

  clearFilters(): void {
    this.currentFilters = {
      courseType: 'all',
      publishedDate: 'anytime',
      rating: [],
      categories: [],
      level: []
    };

    // Reset selected states
    this.filterGroups.forEach(group => {
      group.options.forEach(option => {
        if (group.key === 'courseType' && option.id === 'all') {
          option.selected = true;
        } else if (group.key === 'publishedDate' && option.id === 'anytime') {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
    });

    this.filtersChanged.emit({ ...this.currentFilters });
  }

  getActiveFiltersCount(): number {
    let count = 0;
    Object.keys(this.currentFilters).forEach(key => {
      const value = this.currentFilters[key];
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value !== 'all' && value !== 'anytime') {
        count += 1;
      }
    });
    return count;
  }
}
