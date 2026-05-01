import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {

  constructor(private router:Router) {

  }
  editArticle() {
    // 導向至 /edit-article/123
    this.router.navigate(['/edit-article']);
  }
  createArticle() {
    // 導向至 /edit-article/123
    this.router.navigate(['/create-article']);
  }
}
