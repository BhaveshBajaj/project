import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../models/blog';

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
  
  // Mock blog data - in a real app this would come from a service
  private blogs: Blog[] = [
    {
      id: 1,
      title: 'Mastering Google Data Analytics: A Complete Guide',
      excerpt: 'Discover the power of Google Analytics and learn how to transform raw data into actionable insights for your business.',
      content: `
        <h2>Introduction to Google Data Analytics</h2>
        <p>Google Analytics is one of the most powerful tools for understanding your website's performance and user behavior. In this comprehensive guide, we'll explore how to leverage its capabilities to make data-driven decisions.</p>
        
        <h3>Getting Started with Google Analytics</h3>
        <p>Setting up Google Analytics is the first step toward understanding your audience. Here's what you need to know:</p>
        <ul>
          <li>Create a Google Analytics account</li>
          <li>Install the tracking code on your website</li>
          <li>Configure your goals and conversions</li>
          <li>Set up custom dimensions and metrics</li>
        </ul>
        
        <h3>Key Metrics to Track</h3>
        <p>Understanding which metrics matter most for your business is crucial:</p>
        <ul>
          <li><strong>Sessions:</strong> The number of times users visited your site</li>
          <li><strong>Page Views:</strong> Total pages viewed by all users</li>
          <li><strong>Bounce Rate:</strong> Percentage of single-page sessions</li>
          <li><strong>Conversion Rate:</strong> Percentage of sessions that resulted in a goal completion</li>
        </ul>
        
        <h3>Advanced Analytics Techniques</h3>
        <p>Once you're comfortable with the basics, these advanced techniques can provide deeper insights:</p>
        <ul>
          <li>Cohort analysis for user retention</li>
          <li>Attribution modeling for multi-channel funnels</li>
          <li>Custom reports and dashboards</li>
          <li>Integration with Google Ads and Search Console</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Google Analytics is an essential tool for any business looking to understand their online presence. By following the strategies outlined in this guide, you'll be well on your way to making data-driven decisions that drive growth.</p>
      `,
      imageUrl: 'https://i.imgur.com/3q6CqYq.png',
      author: 'John Doe',
      authorId: 2,
      readTime: '5 min read',
      publishedDate: '2024-01-15',
      category: 'Analytics',
      tags: ['Google Analytics', 'Data Analysis', 'Web Analytics'],
      views: 1247,
      likes: 89
    },
    {
      id: 2,
      title: 'Cybersecurity Best Practices for 2024',
      excerpt: 'Stay ahead of cyber threats with these essential security practices and tools every developer should know.',
      content: `
        <h2>The Current Cybersecurity Landscape</h2>
        <p>As we move through 2024, cybersecurity threats continue to evolve at an unprecedented pace. Organizations must stay vigilant and implement robust security measures to protect their data and systems.</p>
        
        <h3>Essential Security Practices</h3>
        <p>Here are the fundamental practices every organization should implement:</p>
        <ul>
          <li>Multi-factor authentication (MFA) for all accounts</li>
          <li>Regular security awareness training for employees</li>
          <li>Automated patch management systems</li>
          <li>Zero-trust network architecture</li>
        </ul>
        
        <h3>Emerging Threats to Watch</h3>
        <p>Stay informed about these evolving threat vectors:</p>
        <ul>
          <li>AI-powered phishing attacks</li>
          <li>Supply chain vulnerabilities</li>
          <li>Cloud misconfigurations</li>
          <li>IoT device security gaps</li>
        </ul>
        
        <h3>Tools and Technologies</h3>
        <p>Leverage these tools to strengthen your security posture:</p>
        <ul>
          <li>SIEM solutions for threat detection</li>
          <li>Endpoint detection and response (EDR)</li>
          <li>Vulnerability scanners</li>
          <li>Security orchestration platforms</li>
        </ul>
      `,
      imageUrl: 'https://i.imgur.com/Y8L4En5.png',
      author: 'Jane Smith',
      authorId: 3,
      readTime: '7 min read',
      publishedDate: '2024-01-10',
      category: 'Security',
      tags: ['Cybersecurity', 'Data Protection', 'Best Practices'],
      views: 892,
      likes: 67
    }
    // Add more blogs as needed...
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const blogId = Number(params['id']);
      if (blogId) {
        this.loadBlog(blogId);
      }
    });
  }

  private loadBlog(blogId: number): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.blog = this.blogs.find(b => b.id === blogId) || null;
      this.isLoading = false;
      
      if (!this.blog) {
        this.router.navigate(['/dashboard']);
      }
    }, 500);
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
}
