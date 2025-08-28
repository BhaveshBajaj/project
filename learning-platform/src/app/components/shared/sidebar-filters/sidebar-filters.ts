import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../models/course';

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
export class SidebarFiltersComponent implements OnChanges {
  @Output() filtersChanged = new EventEmitter<FilterState>();
  @Input() courses: Course[] = [];

  searchQuery = '';
  
  filterGroups: FilterGroup[] = [
    {
      title: 'Courses',
      key: 'courseType',
      multiSelect: false,
      options: [
        { id: 'all', label: 'All Courses', count: 0, selected: true },
        { id: 'enrolled', label: 'Enrolled Courses', count: 0 },
        { id: 'completed', label: 'Completed', count: 0 },
        { id: 'in-progress', label: 'In Progress', count: 0 },
        { id: 'certificates', label: 'Certificates', count: 0 },
        { id: 'bookmarks', label: 'Bookmarks', count: 0 }
      ]
    },
    {
      title: 'Rating',
      key: 'rating',
      multiSelect: true,
      options: [
        { id: '5', label: '★★★★★ 5.0', count: 0 },
        { id: '4', label: '★★★★☆ 4.0 & up', count: 0 },
        { id: '3', label: '★★★☆☆ 3.0 & up', count: 0 },
        { id: '2', label: '★★☆☆☆ 2.0 & up', count: 0 },
        { id: '1', label: '★☆☆☆☆ 1.0 & up', count: 0 }
      ]
    },
    {
      title: 'Published Date',
      key: 'publishedDate',
      multiSelect: false,
      options: [
        { id: 'anytime', label: 'Any time', count: 0, selected: true },
        { id: 'last-week', label: 'Last week', count: 0 },
        { id: 'last-month', label: 'Last month', count: 0 },
        { id: 'last-year', label: 'Last year', count: 0 }
      ]
    },
    {
      title: 'Categories',
      key: 'categories',
      multiSelect: true,
      options: [
        { id: 'data-science', label: 'Data Science', count: 0 },
        { id: 'programming', label: 'Programming', count: 0 },
        { id: 'machine-learning', label: 'Machine Learning', count: 0 },
        { id: 'web-development', label: 'Web Development', count: 0 },
        { id: 'mobile-dev', label: 'Mobile Development', count: 0 },
        { id: 'cloud-computing', label: 'Cloud Computing', count: 0 },
        { id: 'cybersecurity', label: 'Cybersecurity', count: 0 },
        { id: 'ui-ux', label: 'UI/UX Design', count: 0 }
      ]
    },
    {
      title: 'Course Level',
      key: 'level',
      multiSelect: true,
      options: [
        { id: 'beginner', label: 'Beginner', count: 0 },
        { id: 'intermediate', label: 'Intermediate', count: 0 },
        { id: 'advanced', label: 'Advanced', count: 0 },
        { id: 'expert', label: 'Expert', count: 0 }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courses']) {
      this.updateFilterCounts();
    }
  }

  private updateFilterCounts(): void {
    // Update course type counts
    const courseTypeGroup = this.filterGroups.find(g => g.key === 'courseType');
    if (courseTypeGroup) {
      courseTypeGroup.options.forEach(option => {
        if (option.id === 'all') {
          option.count = this.courses.length;
        } else {
          // For now, set other course types to 0 since we don't have enrollment data
          option.count = 0;
        }
      });
    }

    // Update rating counts
    const ratingGroup = this.filterGroups.find(g => g.key === 'rating');
    if (ratingGroup) {
      ratingGroup.options.forEach(option => {
        const minRating = parseFloat(option.id);
        option.count = this.courses.filter(course => course.rating >= minRating).length;
      });
    }

    // Update published date counts
    const publishedDateGroup = this.filterGroups.find(g => g.key === 'publishedDate');
    if (publishedDateGroup) {
      const now = new Date();
      publishedDateGroup.options.forEach(option => {
        if (option.id === 'anytime') {
          option.count = this.courses.length;
        } else {
          option.count = this.courses.filter(course => {
            const publishedDate = new Date(course.publishedDate);
            const diffTime = now.getTime() - publishedDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            switch (option.id) {
              case 'last-week':
                return diffDays <= 7;
              case 'last-month':
                return diffDays <= 30;
              case 'last-year':
                return diffDays <= 365;
              default:
                return false;
            }
          }).length;
        }
      });
    }

    // Update category counts
    const categoryGroup = this.filterGroups.find(g => g.key === 'categories');
    if (categoryGroup) {
      categoryGroup.options.forEach(option => {
        const categoryLabel = option.id.replace('-', ' ').toLowerCase();
        option.count = this.courses.filter(course => 
          course.skills.some(skill => 
            skill.toLowerCase().includes(categoryLabel) || 
            categoryLabel.includes(skill.toLowerCase())
          )
        ).length;
      });
    }

    // Update level counts
    const levelGroup = this.filterGroups.find(g => g.key === 'level');
    if (levelGroup) {
      levelGroup.options.forEach(option => {
        option.count = this.courses.filter(course => 
          course.difficulty.toLowerCase().includes(option.id.toLowerCase())
        ).length;
      });
    }
  }

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
