import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../article.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  title = '';
  content = '';
  category = '';
  author = '';
  isEdit = false;
  articleId: number | null = null;

  // 图片上传相关
  selectedFiles: File[] = [];           // 新选择的文件
  imagePreviews: string[] = [];         // 新图片的本地预览URL
  existingImages: string[] = [];        // 编辑模式下已有的图片URL
  uploading = false;

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
        this.content = article.content;
        this.category = article.category || '';
        this.author = article.author || '';

        // 解析已有图片URL（假设用逗号分隔）
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

      // 为每个新文件生成预览
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    // 清空input，允许再次选择相同文件
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
    // 合并保留的已有图片和新上传图片的URL
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

    // 返回逗号分隔的字符串
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
        content: this.content.trim(),
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
