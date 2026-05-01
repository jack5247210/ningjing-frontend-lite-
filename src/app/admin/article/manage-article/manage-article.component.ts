import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../article.service';

@Component({
  selector: 'app-manage-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-article.component.html',
  styleUrls: ['./manage-article.component.scss']
})
export class ManageArticleComponent implements OnInit {
  articles: any[] = [];
  filteredArticles: any[] = [];
  loading = false;
  error = '';

  // 排序相关
  sortColumn = 'articleId';
  sortDirection: 'asc' | 'desc' = 'desc';

  // 分类筛选
  categoryFilter = '';

  // 动态获取所有不重复的分类
  get allCategories(): string[] {
    return [...new Set(this.articles.map(a => a.category).filter(Boolean))];
  }

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.loading = true;
    // 获取所有文章（最多100条，可根据需要调整）
    this.articleService.getArticles(0, 100).subscribe({
      next: (pageData) => {
        this.articles = pageData.content;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (err) => {
        this.error = '載入文章失敗';
        this.loading = false;
      }
    });
  }

  // ─── 筛选 + 排序 ──────────────────────────────
  applyFilterAndSort() {
    let data = [...this.articles];

    // 按分类筛选
    if (this.categoryFilter) {
      data = data.filter(a => a.category === this.categoryFilter);
    }

    // 排序
    data.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      if (typeof valA === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }
    });

    this.filteredArticles = data;
  }

  onCategoryChange() {
    this.applyFilterAndSort();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  // ─── 操作 ────────────────────────────────────
  editArticle(id: number) {
    this.router.navigate(['/admin/articles/edit', id]);
  }

  deleteArticle(id: number) {
    if (confirm('確定刪除此文章？')) {
      this.articleService.deleteArticle(id).subscribe({
        next: () => this.loadArticles(),
        error: () => alert('刪除失敗')
      });
    }
  }
}
