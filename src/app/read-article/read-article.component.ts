import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { CommentService, CommentRes, CommentReq } from '../comment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-read-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUrlPipe],
  templateUrl: './read-article.component.html',
  styleUrls: ['./read-article.component.scss']
})
export class ReadArticleComponent implements OnInit {
  article: any = null;
  comments: CommentRes[] = [];
  newComment: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!userId;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadArticle(id);
      this.loadComments(id);
    }
  }

  loadArticle(id: number) {
    this.articleService.getArticleById(id).subscribe({
      next: (data) => (this.article = data),
      error: (err) => console.error('讀取文章失敗', err)
    });
  }

  loadComments(articleId: number) {
    this.commentService.getCommentsByArticle(articleId).subscribe({
      next: (data) => (this.comments = data),
      error: (err) => console.error('讀取評論失敗', err)
    });
  }

  // 获取当前登录用户的首字母（用于输入框左侧头像）
  getUserInitial(): string {
    const userName = localStorage.getItem('userName');
    return userName ? userName.charAt(0).toUpperCase() : '訪';
  }

  // 获取指定用户名的首字母
  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  // 根据用户名生成固定的柔和背景色
  getAvatarColor(seed?: string): string {
    const str = seed || localStorage.getItem('userName') || 'user';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 30%, 75%)`;
  }

  // 格式化时间为相对时间
  // 格式化时间为相对时间
formatTime(dateStr: string): string {
  if (!dateStr) return '—';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';   // 无效日期

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '剛剛';
  if (diffMin < 60) return `${diffMin} 分鐘前`;
  if (diffHour < 24) return `${diffHour} 小時前`;
  if (diffDay < 7) return `${diffDay} 天前`;
  return date.toLocaleDateString('zh-TW');
}


  // 输入框自动调整高度
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  submitComment() {
    if (!this.newComment.trim()) return;

    if (!this.isLoggedIn) {
      alert('請先登入再留言');
      this.router.navigateByUrl('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    const commentReq: CommentReq = {
      articleId: this.article.articleId,
      userId: Number(userId),
      content: this.newComment
    };

    this.commentService.addComment(commentReq).subscribe({
      next: (newComment) => {
        this.comments.unshift(newComment);
        this.newComment = '';
      },
      error: (err) => console.error('發表評論失敗', err)
    });
  }
}
