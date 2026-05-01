import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit {
  articles: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;

  categories: string[] = [];
  selectedCategory: string | null = null;

  constructor(private service: ArticleService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadArticles();
  }

  loadCategories() {
    this.service.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('获取分类失败', err)
    });
  }

  loadArticles() {
    this.service.getArticles(
      this.currentPage - 1,
      10,
      this.selectedCategory || undefined
    ).subscribe({
      next: (pageData) => {
        this.articles = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
      },
      error: (err) => console.error('读取文章失败', err)
    });
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadArticles();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadArticles();
    }
  }

  get pageNumbers(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  get hasNoArticles(): boolean {
    return this.articles.length === 0;
  }
}
