import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../article.service';
import { lastValueFrom } from 'rxjs';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, AngularEditorModule],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  title = '';
  summary = '';        // ✅ 新增摘要屬性
  content = '';
  category = '';
  author = '';
  isEdit = false;
  articleId: number | null = null;

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: string[] = [];
  uploading = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '320px',
    minHeight: '200px',
    placeholder: '請撰寫文章內容...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      ['subscript', 'superscript'],
      ['insertImage', 'insertVideo', 'customClasses']
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.articleId = Number(idParam);
      if (this.articleId) {
        this.isEdit = true;
        this.loadArticleData();
      }
    }
  }

  private loadArticleData(): void {
    this.articleService.getArticleById(this.articleId!).subscribe({
      next: (article) => {
        this.title = article.title;
        this.summary = article.summary || '';   // ✅ 載入摘要
        this.content = article.content;
        this.category = article.category || '';
        this.author = article.author || '';

        if (article.articleImg) {
          this.existingImages = article.articleImg
            .split(',')
            .map((url: string) => url.trim())
            .filter((url: string) => url !== '');
        } else {
          this.existingImages = [];
        }
      },
      error: () => {
        alert('載入文章失敗');
        this.router.navigate(['/admin/articles']);
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...files];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  removeSelectedImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  private async uploadAllImages(): Promise<string> {
    let finalUrls: string[] = [...this.existingImages];
    if (this.selectedFiles.length > 0) {
      this.uploading = true;
      try {
        const res = await lastValueFrom(this.articleService.uploadImages(this.selectedFiles));
        if (res && res.urls) {
          finalUrls = finalUrls.concat(res.urls);
        }
      } catch (err) {
        alert('圖片上傳失敗');
        throw err;
      } finally {
        this.uploading = false;
      }
    }
    return finalUrls.join(',');
  }

  async submitForm(): Promise<void> {
    if (!this.title.trim() || !this.content.trim()) {
      alert('請填寫標題與內容');
      return;
    }
    try {
      const imageUrls = await this.uploadAllImages();
      const articleData = {
        title: this.title.trim(),
        summary: this.summary.trim(),   // ✅ 送出摘要
        content: this.content,          // 保留 HTML 格式
        articleImg: imageUrls,
        category: this.category.trim(),
        author: this.author.trim()
      };

      if (this.isEdit) {
        this.articleService.updateArticle(this.articleId!, articleData).subscribe({
          next: () => {
            alert('文章更新成功');
            this.router.navigate(['/admin/articles']);
          },
          error: () => alert('更新失敗')
        });
      } else {
        this.articleService.createArticle(articleData).subscribe({
          next: () => {
            alert('文章新增成功');
            this.router.navigate(['/admin/articles']);
          },
          error: () => alert('新增失敗')
        });
      }
    } catch (error) {
      console.error('上傳流程出錯', error);
    }
  }
}
